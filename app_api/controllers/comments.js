var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');//model name
var User = mongoose.model('User');//model name

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
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
        date: datatime
    }, function(error, comment){
        if(error){
            JSONcallback(res,404,{
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

var deleteCommentFromUser = function(res,comment,username){

    User.updateOne({
                mail: username
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
                }
                console.log(comment," is removed to the list of your comments");
                JSONcallback(res, 200, {
                    removed: comment
                    
                });
            });
};

module.exports.getAll = function(req, res) {
    Comment.find()
    .exec(function(err, comment){
        if (err) {
            console.log(err);
            JSONcallback(err, 400, comment);
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
        JSONcallback(res, 400, {
          msg: "All data req."
        });
        return;
    }
    
    User.findOne({
            mail: req.body.username
        }).exec(function(error,user){
            if(error){
                JSONcallback(res, 404, {
                  msg: error
                });
                return;
            }
            if(!user){
                JSONcallback(res, 401, {
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
            JSONcallback(res,400,error);
        } else {
            JSONcallback(res, 200, data);
        }
    });
};

module.exports.getCommentById = function(req, res) {
    Comment.findById(
         req.params.idComment, function(error, data){
        if(error){
            JSONcallback(res,400,error);
        } else {
            JSONcallback(res, 200, data);
        }
    });
};

module.exports.deleteCommentById = function(req, res) {
    
    //check if user has a comment
    Comment
    .deleteOne({ _id: req.params.idComment })
    //populate create to fatch the user
    .populate('_creator')
    .exec(function (error, content) {
    if (error) {
      JSONcallback(res,400,error);
    } else {
        console.log(content);
        deleteCommentFromUser(res,content, req.body.username);
    }});
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
                JSONcallback(res,400,error);
            } else {
                if (error) return console.error(error);
                    JSONcallback(res, 200, data);
                    //console.log("Prior send",data);
            }
        });
};

