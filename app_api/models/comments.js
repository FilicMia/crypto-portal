//do not forget to add this shemein db.js
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  _creator: { type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' },
  name: {type: String, required: true},
  comment: String,
  pic: String,
  date: Date
});

//Translating the scheme into a model
mongoose.model('Comment',//model name
commentSchema,//shema name
'Comments'  //name of the mongo db collection od documents 
);