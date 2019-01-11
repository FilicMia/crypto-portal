var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

var decodeAndVerify = function(req, res){
    var authorization = req.headers.authorization,
            decoded;
        authorization = authorization.split(' ')[1];
        try {
            decoded = jwt.verify(authorization, process.env.JWT_PASS);
        } catch (e) {
            res.status(401).send('unauthorized');
            return false;
        }
        
        return decoded;
};

module.exports.getAll = function(req, res) {
    //get header auth token.
    if (req.headers && req.headers.authorization) {
        var decoded = decodeAndVerify(req, res);
        if(!decoded || !decoded.admin) return JSONcallback(res,401,{msg: 'Unauthorized'});
        
        User.find()
        .exec(function(err, users){
            if (err) {
                console.log(err);
                JSONcallback(err, 500, users);
            }else{
                JSONcallback(res, 200, users);
            }
        });
    }
};

module.exports.getUserById = function(req, res) {
        //get header auth token.
    if (req.headers && req.headers.authorization) {
        var decoded = decodeAndVerify(req, res);
        if(!decoded || !decoded.admin) return JSONcallback(res,401,{msg: 'Unauthorized'});
        
        User.findById(
             req.params.idUser, function(error, data){
            if(error){
                JSONcallback(res,500,error);
            } else {
                JSONcallback(res, 200, data);
            }
        });
    }
};

module.exports.deleteUserById = function(req, res) {
    if (req.headers && req.headers.authorization) {
        var decoded = decodeAndVerify(req, res);
        if(!decoded || !decoded.admin) return JSONcallback(res,401,{msg: 'Unauthorized'});
        
        User.deleteOne({ _id: req.params.idUser }, function (error, content) {
        if (error) {
          
        } else {
           JSONcallback(res, 200, {"status": content});
        }});
    }
};