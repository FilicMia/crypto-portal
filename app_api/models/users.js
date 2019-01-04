//do not forget to add this shemein db.js
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  mail: {type: String, unique: true, required: true},
  name: {type: String, required: true},
  hashValue: String,
  randValue: String
});

//encryption
userSchema.methods.storePassword = function(password){
  this.randValue = crypto.randomBytes(16).toString('hex');
  this.hashValue = crypto.pbkdf2Sync(password, this.randValue, 1000, 64, 'sha512').toString('hex');
  /*
  DK = PBKDF2(Password, Salt, c, dkLen, PRF)
    where:
    Password is the master password from which a derived key is generated
    Salt is a sequence of bits, known as a cryptographic salt
    c is the number of iterations desired
    dkLen is the desired bit-length of the derived key
    DK is the generated derived key
    PRF is a pseudorandom function of two parameters with output length hLen (e.g., a keyed HMAC)
  */
};

//decryption
userSchema.methods.checkPassword = function(password){
  var hashValue = crypto.pbkdf2Sync(password, this.randValue, 1000, 64, 'sha512').toString('hex');
  return this.hashValue == hashValue;
};

// generate JWT
userSchema.methods.genJWT = function(){
  var validityDate = new Date();
  
  // valid for 7 days
  validityDate.setDate(validityDate.getDate() + 7);
  
  //get the timestamp in seconds
  console.log('genJwt');
  
  //generating signed jwt, with the private password, 
  //stored in system variable and not the code.
  return jwt.sign({
    _id: this._id,
    name: this.name,
    mail: this.mail,
    validityDate: parseInt(validityDate.getTime() / 1000, 10)
  }, process.env.JWT_PASS);
  
};



//Translating the scheme into a model
mongoose.model('User',//model name
userSchema,//shema name
'Users'  //name of the mongo db collection od documents 
);