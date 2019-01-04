/* Vrni začetno stran s seznamom lokacij */
//var dataJSON = require('../models/comments.json');
/*var request = require('request');
var paramsApi = {
  server: 'http://localhost:' + process.env.PORT,
  apiCommentsURI: '/api/comments'
};
if (process.env.NODE_ENV === 'production') {
  paramsApi.server = 'https://drugo-ime238.herokuapp.com';
  paramsApi.apiCommentsURI = '/api/comments';
}

/* GET home page with ANGULAR
module.exports.index = function(req, res) {
  res.render('comments', {urlNewCom: req.originalUrl + '/new'});
};
*/

/* Create new comment.   */
/*
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

*/
