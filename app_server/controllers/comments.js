/* Vrni začetno stran s seznamom lokacij */
//var dataJSON = require('../models/comments.json');
var request = require('request');
var paramsApi = {
  server: 'http://localhost:' + process.env.PORT,
  apiCommentsURI: '/api/comments'
};
if (process.env.NODE_ENV === 'production') {
  paramsApi.server = 'https://drugo-ime238.herokuapp.com';
  paramsApi.apiCommentsURI = '/api/comments';
}

// return function
var listRender = function(req, res, content){
    /*Get rest api data*/
  var apiData = {comments: content};
      res.render('comments', apiData);
}

/* GET home page 
module.exports.index = function(req, res) {
  var path = paramsApi.apiCommentsURI;
  var paramsReq = {
    url: paramsApi.server + path,
    method: 'GET',
    json: {},
  };
  request(
    paramsReq,
    function(error, response, content) {
      listRender(req, res, content);    
    }
  );
};
*/

var rp = require('request-promise');
/* GET home page with promise */
module.exports.index = function(req, res) {
  var path = paramsApi.apiCommentsURI;
  var paramsReq = {
    url: paramsApi.server + path,
    method: 'GET',
    json: true, //parse to json
  };
  rp(paramsReq)
  .then(
    function(content) {
      listRender(req, res, content);    
    })
  .catch(function (err) {
      res.render('error',err);
  });
};

/* Create new comment.   */
module.exports.newComment = function(req, res) {
  var datetime = new Date();
  var path = paramsApi.apiCommentsURI + '/new';
  var dataToSend = {
    name: req.body.name,
    comment: req.body.comment,
    pic: "",
    date: datetime
  };
  
  var paramsReq = {
    url: paramsApi.server + path,
    method: 'POST',
    json: dataToSend,
  };
  request(
    paramsReq,
    function(error, response, content) {
      if (!error || error.statusCode === 201) {
        res.redirect('/comments');
      } else {
        res.render('error', error);
      } 
    }
  );
};

/* Get all with the certain name.   */
module.exports.getCommentsByName = function(req, res) {
  var path = paramsApi.apiCommentsURI + '/search?name='+req.query.name;
  
  var paramsReq = {
    url: paramsApi.server + path,
    method: 'GET',
    json: {},
  };
  request(
    paramsReq,
    function(error, response, content) {
      if (!error || error.statusCode === 201) {
        listRender(req, res, content);
      } else {
        res.render('error', error);
      } 
    }
  );
};

module.exports.deleteById = function(req, res) {
  console.log("Server req to delete comment "+req.body._id);
  var path = paramsApi.apiCommentsURI + '/'+req.body._id;

  var paramsReq = {
    url: paramsApi.server + path,
    method: 'DELETE',
    json: {},
  };
  request(
    paramsReq,
    function(error, response, content) {
      if (!error || error.statusCode === 201) {
        res.redirect('/comments');
      } else {
        res.render('error', error);
      } 
    }
  );
};

