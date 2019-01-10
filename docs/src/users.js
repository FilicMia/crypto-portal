//do not forget to add this shemein db.js
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  mail: {type: String, unique: true, required: true},
  name: {type: String, required: true},
  hashValue: String,
  randValue: String
});

//Translating the scheme into a model
mongoose.model('User',//model name
userSchema,//shema name
'Users'  //name of the mongo db collection od documents 
);