var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');//model name

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
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
    Comment.create({
        name: req.body.name,
        comment: req.body.comment,
        pic: req.body.pic,
        date: datatime
    }, function(error, data){
        if(error){
            JSONcallback(res,400,error);
        } else {
            JSONcallback(res, 200, data);
        }
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
    console.log(req.params.idComment);
    Comment.deleteOne({ _id: req.params.idComment }, function (error, content) {
    if (error) {
      
    } else {
       JSONcallback(res, 200, {"status": content});
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
         {$set: { comment: req.body.comment , date: datetime}},
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

