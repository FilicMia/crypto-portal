var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

module.exports.login = function(req, res) {
    /* request consists of body with login data named usernameField: 'mail',
    passwordField: 'pass' as defined in `passport.js` */
    if(!req.body || !req.body.mail || !req.body.pass){
        JSONcallback(res, 400, {
          msg: "All data required."
        });
        return;
    }
    
    if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.mail))) {
      JSONcallback(res, 400, {
        msg: "Username should be of type email."
      });
      return;
    }
    
    //when all set, authenticate the user data
    passport.authenticate('local', //strategy
        function(error, user, data){
            if(error){
                JSONcallback(res, 403, {
                  msg: "Forbiden access."
                });
                return;
            }
            if(!user){
                JSONcallback(res, 403, {
                  msg: 'You need to be authenticated.',
                  data: data
                });
                return;                
            }
            JSONcallback(res, 201, {
              token: user.genJWT()
            });
        }
    )(req,res);
};

module.exports.register = function(req, res) {
    /* request consists of body with login data named usernameField: 'mail',
    passwordField: 'pass' as defined in `passport.js` */
    if(!req.body || !req.body.mail || !req.body.pass || !req.body.name){
        JSONcallback(res, 400, {
          msg: "All data required."
        });
        return;
    }

    if (!(/^\w+$/.test(req.body.name))) {
      JSONcallback(res, 400, {
        msg: "Name should contain only alphanumeric characters!"
      });
      return;
    }
    
    if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.mail))) {
      JSONcallback(res, 400, {
        msg: "Mail should be of type email."
      });
      return;
    }
    
    var user = new User({
           name:  req.body.name,
           mail: req.body.mail,
           //only in database mlab we can change this permission.
           admin: false
        });
        
    user.storePassword(req.body.pass);
    
    user.save(function(error,user){
        if(error){
                JSONcallback(res, 500, {
                  msg: error
                });
                return;
        }
        if(user){
            JSONcallback(res, 201, {
                token: user.genJWT()
            });
        }
    });
};