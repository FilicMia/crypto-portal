//do not forget to add this shemein db.js
var mongoose = require('mongoose');

var commentShema = new mongoose.Schema({
  name: {type: String, required: true},
  comment: String,
  pic: String,
  date: Date
});

//Translating the scheme into a model
mongoose.model('Comment',//model name
commentShema,//shema name
'Comments'  //name of the mongo db collection od documents 
);