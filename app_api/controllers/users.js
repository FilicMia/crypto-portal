var mongoose = require('mongoose');
var User = mongoose.model('User');

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

module.exports.getAll = function(req, res) {
    User.find()
    .exec(function(err, users){
        if (err) {
            console.log(err);
            JSONcallback(err, 400, users);
        }else{
            JSONcallback(res, 200, users);
        }
    });
};

module.exports.getUserById = function(req, res) {
    User.findById(
         req.params.idUser, function(error, data){
        if(error){
            JSONcallback(res,400,error);
        } else {
            JSONcallback(res, 200, data);
        }
    });
};

module.exports.deleteUserById = function(req, res) {
 
    User.deleteOne({ _id: req.params.idUser }, function (error, content) {
    if (error) {
      
    } else {
       JSONcallback(res, 200, {"status": content});
    }});
};