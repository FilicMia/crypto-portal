require('dotenv').load();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//minify part
var uglifyJs = require('uglify-js');
var fs = require('fs');

var combinedCode = uglifyJs.minify({
  'app.js': fs.readFileSync('app_client/app.js', 'utf-8'),
  'commentsData.service.js': fs.readFileSync('app_client/all/services/commentsData.service.js', 'utf-8'),
  // auth client side
  'auth.service.js': fs.readFileSync('app_client/all/services/auth.service.js', 'utf-8'),
  'login.controller.js': fs.readFileSync('app_client/auth/login/login.controller.js', 'utf-8'),
  'registration.controller.js': fs.readFileSync('app_client/auth/registration/registration.controller.js', 'utf-8'),

  'comments.controller.js': fs.readFileSync('app_client/comments/comments.controller.js', 'utf-8'),
  'commentView.controller.js': fs.readFileSync('app_client/comments/commentViewing/commentView.controller.js', 'utf-8'),
  'commentEdit.controller.js': fs.readFileSync('app_client/comments/commentEdit/commentEdit.controller.js', 'utf-8'),
  'comment.controller.js': fs.readFileSync('app_client/all/directives/comment/comment.controller.js', 'utf-8'),
  'comment.directive.js': fs.readFileSync('app_client/all/directives/comment/comment.directive.js', 'utf-8'),
  'footer.directive.js': fs.readFileSync('app_client/all/directives/footer/footer.directive.js', 'utf-8'),
  'nav.controller.js': fs.readFileSync('app_client/all/directives/nav/nav.controller.js', 'utf-8'),
  'nav.directive.js': fs.readFileSync('app_client/all/directives/nav/nav.directive.js', 'utf-8')
});

fs.writeFile('public/angular/comments.min.js', combinedCode.code, function(error) {
  if (error)
    console.log(error);
  else
    console.log('Script is in "comments.min.js".');
});

var passport = require('passport');

//add path to the REST api
require('./app_api/models/db');
require('./app_api/configuration/passport');

var indexApi = require('./app_api/routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server','views'));
app.set('view engine', 'pug');

// Remove errors in security discovered by the ZAP (low and medium level).
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.use(passport.initialize());

app.use('/api', indexApi);

//handle all the other reqs.
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
