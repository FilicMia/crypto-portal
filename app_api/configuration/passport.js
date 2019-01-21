//move to configuration folder
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');

//custom field names
passport.use(new localStrategy({
    usernameField: 'mail',
    passwordField: 'pass'}, 
    function(username, pass, done){
        User.findOne({
            mail: username
        }).exec(function(error,user){
            if(error){
                done(error);
                return;
            }
            if(!user){
                done(null,false,{
                    msg: "Wrong username"
                });
                return;
            } 
            if(!user.checkPassword(pass)){
                done(null,false,{
                    msg: "Wrong password"
                });
                return;
            }
            done(null,user);
        });
}));

// define in app.js
/*
require('./app_api/models/db');
..

var indexApi = require('./app_api/routes/index');
...
app.use(passport.initialize());
*/