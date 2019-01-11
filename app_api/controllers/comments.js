var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');//model name
var User = mongoose.model('User');//model name
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
            return false;
        }
        
        return decoded;
};

var createComment = function(req,res,user,datatime){
    /*
        The .save() is an instance method of the model, while the 
        .create() is called directly from the Model as a method call, 
        being static in nature, and takes the object as a first parameter.
    */
    Comment.create({
        _creator: user._id,
        name: req.body.name,
        comment: req.body.comment,
        pic: req.body.pic,
        date: datatime,
        admin: user.admin // did admin created the comment
    }, function(error, comment){
        if(error){
            JSONcallback(res,500,{
                msg: 'Error while storing the comment.'+
                ' Comment not stored.'
            });
        } else {
            //save to certain user as well
            User.updateOne({
                _id: user._id
            }, {
                $push: {
                        comments: comment._id
                    }
                }).exec(function(err, user){
                    console.log(comment, " is added to the list of your comments");
                    JSONcallback(res, 200, comment);
                });
        }
    });
};

var deleteCommentFromUser = function(res,comment){
    User.updateOne({
                _id: comment._creator
            }, {
            $pull: {
                    comments: comment._id
                }
            }).exec(function(err, user){
                if(err){
                    JSONcallback(res, 500, {
                    msg: 'Error while deleting comment from the user. '+
                    'Comment is deleted but the user\'s ref has stayed. '+
                    'Inconsistant state of the user.'+user.mail
                    });
                } else {
                console.log(user," is removed to the list of your comments");
                JSONcallback(res, 200, {
                    removed: comment
                    
                });}
            });
};

module.exports.getAll = function(req, res) {
    Comment.find()
    .exec(function(err, comment){
        if (err) {
            console.log(err);
            JSONcallback(err, 500, comment);
        }else{
            JSONcallback(res, 200, comment);
        }
    });
};

module.exports.createNew = function(req, res) {
    var datatime = req.body.date;
    if(!datatime){
        datatime = new Date()
    }
    /* request consists of body with username - attached to valid user
        and comments needed data.*/
    if( !req.body.username || !req.body.name 
            || !req.body.comment){
        JSONcallback(res, 500, {
          msg: "All data req."
        });
        return;
    }
    
    User.findOne({
            mail: req.body.username
        }).exec(function(error,user){
            if(error){
                JSONcallback(res, 500, {
                  msg: error
                });
                return;
            }
            if(!user){
                JSONcallback(res, 500, {
                  msg: "No user with username:"+req.body.username
                  +". Comment can not be added."
                });
                return;
            } 

            createComment(req,res,user,datatime);
        });
};

module.exports.getCommentByName = function(req, res) {
    Comment.find({
        name: req.query.name
    }, function(error, data){
        if(error){
            JSONcallback(res,500,error);
        } else {
            JSONcallback(res, 200, data);
        }
    });
};

module.exports.getCommentById = function(req, res) {
    Comment.findById(
         req.params.idComment, function(error, data){
        if(error){
            JSONcallback(res,500,error);
        } else {
            JSONcallback(res, 200, data);
        }
    });
};

module.exports.deleteCommentById = function(req, res) {
    //get header auth token.
    if (req.headers && req.headers.authorization) {
        var decoded = decodeAndVerify(req, res);
        if(!decoded) return JSONcallback(res,401,{msg: 'Unauthorized'});
        
        //admin can do anything
        if(decoded.admin){
            Comment
            .findOneAndRemove({
                _id: req.params.idComment 
            })
            .exec(function (error, comment) {
                if (error) {
                    JSONcallback(res,500,{
                      msg: 'Error while deleting the comment. Comment might be in incosistent state.',
                      error: error
                  });
                  return;
                }
                
                JSONcallback(res,200,comment);
            });
            return;
        }
        
        //check if user has a comment
        Comment
        .findOneAndRemove({ 
            _creator: decoded._id,
            _id: req.params.idComment 
        })
        //populate create to fatch the user
        .populate('_creator')
        .exec(function (error, comment) {
        if (error) {
          JSONcallback(res,500,{
              msg: 'Error.',
              error: error
          });
          return;
        } 
        if(!comment) {
            JSONcallback(res,401,{
              msg: 'No comment connected with logedin user.'
          });
        } else {
            deleteCommentFromUser(res,comment);
        }});
    }
};

//suppode to have req.params.idComment & req.body.comment
module.exports.editComment = function(req, res) {
    var datetime = req.body.date;
    if(!datetime){
        datetime = new Date()
    }

    Comment.findByIdAndUpdate(
         req.params.idComment, 
         {$set: 
            { 
                comment: req.body.comment , 
                date: datetime
            }
         },
         {new: true},
         function(error, data){
            if(error){
                JSONcallback(res,500,error);
            } else {
                if (error) return console.error(error);
                    JSONcallback(res, 200, data);
                    //console.log("Prior send",data);
            }
        });
};

//if non-admin becomes admin, tehre is no need to update its comments before becoming admin as they are irrelevent,
//it was user and as such posted comments. Only new one are commencted to its position,
//as admin.

