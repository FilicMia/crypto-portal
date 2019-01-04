# Login and registration API

## Database model set up

Tranafer `docs/src/users.js` into `app_api` and define users in your REST 
API by adding
`require('./users');` in `db.js`.

Now, let us upgrade the api so that on `/login` it returnes valit JWT token 
if the sent (login) data is valid:

* the database holds user with certain mail,
* mail and password match.

We first add several methods to the `User`'s model. 

It is not secure to store user's password in form of a plaintext, 
but as a chipher.

> Plaintext and chipertext are cryptographic terms. Plaintext is 
unencrypted text,
while the chipertext is encrypted text. \
>One can encrypt text: 
>
> * for transfer purposes (e.g. comminication chanels, i.e. Enigma WW),
> * for storage purposes (e.g. to store passwords connected with certain user).
>
>
>And to enable:
>
> * to make the content secret (confidentiality),
> * to authenticate the data (authenticity),
> * to protect the data from changing (integrity),
> * that the author cannot successfully dispute its 
  authorship or the validity of an associated data or contract(non-repudiation).

This we do using library `crypto` (the same lib can be used when 
coding in python).

~~~~.js
var crypto = require('crypto');

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
~~~~

> HASHING, DIGITAL SIGNATURES, AND DIGITAL CERTIFICATES
Hashing is used to create a short, fixed-length message digest from a 
file or block of data. Hashing is often used to verify the integrity 
and/or originator of a file. Common hashing algorithms include:
>
>* MD-5 is a formerly popular hashing algorithm developed in 1992. It is now 
considered too weak for reliable use and obsolete.
>* SHA-1 is another popular hashing algorithm that was 
determined in 2005 to be too weak for continued use. By 2010, U.S. government 
agencies were required to replace SHA-1 with SHA-2.
>* SHA-2 is a family of hashing algorithms including SHA-224, SHA-256, 
SHA-384, SHA-512, SHA-512/224, and SHA-512/256. These are all considered 
reliable for ongoing use.
>
>**A digital signature** is a hashing operation carried out on a file. 
Depending on the implementation, the digital signature may be embedded 
in the file or separate from it. A digital signature is used to verify 
the originator of a file.
>
>**A digital certificate** is an electronic document that consists of 
a personal or corporate identifier, a public encryption key, 
and is signed by a certificate authority (CA). The most common 
format for a digital certificate is known as X.509. The use of digital 
certificates and other tools such as strong authentication can lead to 
the failure for an individual to be able to plausibly deny involvement 
with a specific transaction or event. This is known as non-repudiation.

![Representation of the iterative process of the Password Based Key Derivation Function 2](https://upload.wikimedia.org/wikipedia/commons/7/70/Pbkdf2_nist.png)

Stand alone example of password authentication:
https://hptechblogs.com/password-hashing-in-node-js-using-the-pbkdf2-in-crypto-library/

![Test the proposed password against the stored hash to enable access](http://www.unixwiz.net/images/password-hash-2.gif)

source:
[http://www.unixwiz.net/techtips/iguide-crypto-hashes.html](http://www.unixwiz.net/techtips/iguide-crypto-hashes.html)

## JWT generation
Let us now enable generation of the JWT having user's data.
Furthermore, we set the validity period for each token.

~~~~.js
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
~~~~

We sign the jwt so that its origin can be valuated. It is signed using 
private key (password) `process.env.JWT_PASS` stored in `
.env` file in root directory. 
If not contained in `v6`, we create it with the following content.

`.env`

~~~~.bash
JWT_PASS=password
~~~~

To use it in pur app we do the foillowing:

1. install `dotenv` running `npm install dotenv --save` in a terminal within\
v6 directory,
2. include `dotenv` in `app.js` file putting 
~~~~.js
require('dotenv').load();
~~~~
at the begining of the file.

> On heroku, you just store password under `JWT_PASS` as a `Config Vars`.


## Preparing the Authentication API

To implement the Authentication API, we will use the Node.js 
`Passport` library . The key advantage of this library 
is the ability to use different authentication methods , 
called strategies. We use **local strategy** as we are storing 
users and theirs hashed passwords in the API's database.

We run the following in the `v6` directory.
~~~~
npm install --save passport
npm install --save passport-local
cd app_api

mkdir configuration
cd configuration
touch passport.js
~~~~

We have created configuration files of our API.
Its content should be following.

`passport.js`

```.js
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');

//custom field names
passport.use(new localStrategy({
    usernameField: 'mail',
    passwordField: 'pass'}, 
    function(username, pass, done){
        User.findOne({
            mail: username
        }, function(error, user){
            if(error)
                done(error);
            if(!user)
                            //err, user, info
                return done(null, false, {
                        msg: 'Wrong username!'});
            if(!user.checkPassword(pass))
                return done(null, false, {
                        msg: 'Wrong password'
                      });
            return done(null, user);
        });
}));
```

Then we also add it to the root `app.js` file at 32nd and 35th line.

`app.js`

~~~~.js
var passport = require('passport'); // 38 line

require('./app_api/models/db');
require('./app_api/configuration/passport'); // 32 line
~~~~

and init it after definition of `public` (static) folders adding following line
`app.use(passport.initialize());`

## API Access points

To obtain `/login` and `/registration` access points, we create separate 
authentication handling router in file `app_api/controllers/authentication.js`
 
 
~~~~.js
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

//rest TODO
~~~~
 
The we define the authentication controller in the router of the API
`var ctrlAuthentication = require('../controllers/authentication');`
  
and set it to handle authentication routes.

Add the following 
~~~~.js
/* Authentication */
router.post('/login', ctrlAuthentication.login);
router.post('/registration',
                ctrlAuthentication.register);
~~~~
to the `app_api/routes/index.js`, before `module.exports = router;` line.

Implementation of login and register are the following.

`app_api/controllers/authentication.js`

~~~~.js
module.exports.login = function(req, res) {
    /* request consists of body with login data named usernameField: 'mail',
    passwordField: 'pass' as defined in `passport.js` */
    if( !req.body.mail || !req.body.pass){
        JSONcallback(res, 400, {
      msg: "All data req."
    });
    }
    
    //when all set, authenticate the user data
    passport.authenticate('local', //strategy
        function(error, user, data){
            // error is error data
            //user from done function in `passport.js` of type User and 
            //data from the req
            if(error){
                JSONcallback(res, 404, error);
                return;
            }
            if(user){
                JSONcallback(res, 200, {
                    token: user.genJWT()
                });
            } else {
                //unauthorized error
                JSONcallback(res, 401, data);
            }
        }
    )(req,res);
};

~~~~
For register handler we need to do following:

* check for body fields: mail, pass and name,
* create databace document of type `User` with password saved with 
 `storePassword` function,
* save user to database with `user.save`,
~~~~.js
user.save(function(error,user){
        //todo
    });
~~~~
* on save sucess, we generate JWT token with `user.genJWT()` and render it with 
`JSONcallback` function.

More about using passport authenticate in Express application: http://www.passportjs.org/docs/authenticate/.
We have used `passport.authenticate` with custom callback function.

Try it with postman.

# Integrate login and registration with SPA AngularJS application

Using viewvs and controllers stored in `docs/src/auth` folder, we are 
now building client side of the user authentication:

1. copy `docs/src/auth` folder to `app_client`,
2. add in `app_clien/app.js` routes to login and register,
~~~~.js
.when('/registration', {
  templateUrl: '/auth/registration/registration.view.html',
  controller: 'registrationCtrl',
  controllerAs: 'vm'
})
.when('/login', {
  templateUrl: '/auth/login/login.view.html',
  controller: 'loginCtrl',
  controllerAs: 'vm'
})
~~~~
3. create custom auth service in `app_client/all/services/auth.service.js`,
~~~~.js
(function() {
  function authentication($window, $http) {
    /*var b64Utf8 = function (seq) {
      return decodeURIComponent(Array.prototype.map.call($window.atob(seq), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    };*/
    
    var storeToken = function(token) {
      //todo
    };
    
    var returnToken = function() {
     return $window.localStorage['comments-token'];
    };
    
    var registration = function(user) {
      return $http.post('/api/registration', user).then(
        function success(data) {
          storeToken(data.data.token);
        });
    };

    var login = function(user) {
      //todo
    };

    var logout = function() {
      $window.localStorage.removeItem('comments-token');
    };
    
    var logedin = function() {
        //todo
      };
    var currUser = function() {
        if (logedin()) {
          var token = returnToken();
          var content = JSON.parse($window.atob(token.split('.')[1]));
          return {
            mail: content.mail,
            name: content.name
          };
        }
      };

    
    return {
      storeToken: storeToken,
      returnToken: returnToken,
      registration: registration,
      login: login,
      logout: logout,
      logedin: logedin,
      currUser: currUser
    };
  }
  authentication.$inject = ['$window', '$http'];
  
  /* global angular */
  angular
    .module('comments')
    .service('authentication', authentication);
})();
~~~~
4. add all those js files in main `app.js` file minify function:
~~~~.js
var combinedCode = uglifyJs.minify({
  'app.js': fs.readFileSync('app_client/app.js', 'utf-8'),
  'commentsData.service.js': fs.readFileSync('app_client/all/services/commentsData.service.js', 'utf-8'),
  // auth client side
  'auth.service.js': fs.readFileSync('app_client/all/services/auth.service.js', 'utf-8'),
  'login.controller.js': fs.readFileSync('app_client/auth/login/login.controller.js', 'utf-8'),
  'registration.controller.js': fs.readFileSync('app_client/auth/registration/registration.controller.js', 'utf-8'),
  //
  'comments.controller.js': fs.readFileSync('app_client/comments/comments.controller.js', 'utf-8'),
  'other.controller.js': fs.readFileSync('app_client/other.controller.js', 'utf-8'),
  'commentView.controller.js': fs.readFileSync('app_client/comments/commentViewing/commentView.controller.js', 'utf-8'),
  'commentEdit.controller.js': fs.readFileSync('app_client/comments/commentEdit/commentEdit.controller.js', 'utf-8'),
  'comment.directive.js': fs.readFileSync('app_client/all/directives/comment/comment.directive.js', 'utf-8'),
  'footer.directive.js': fs.readFileSync('app_client/all/directives/footer/footer.directive.js', 'utf-8'),
  'nav.directive.js': fs.readFileSync('app_client/all/directives/nav/nav.directive.js', 'utf-8')
});
~~~~
5. add login/registration to navigation
```.html
<nav class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header"><a class="navbar-brand" href="#">ComMENT TO BE</a></div>
            <ul class="nav navbar-nav">
                <li><a href="/">Home</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/registration">Register</a></li>
            </ul>
        </div>
</nav>
```

As there is no need to show registration link when loged in, 
we change navigation template to the following.
~~~~.js
<nav class="navbar navbar-inverse">
        <div class="container-fluid">
            <div class="navbar-header"><a class="navbar-brand" href="#">ComMENT TO BE</a></div>
            <ul class="nav navbar-nav">
                <li><a href="/">Home</a></li>
                <li ng-hide="navigavm.logedin"><a href="/login?page={{ navigavm.currLocation }}">Login</a></li>
                <li ng-show="navigavm.logedin" class="dropdown">
                    <a href="" class="dropdown-toggle" data-toggle="dropdown">{{ navigavm.currUser.name }} <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                      <li><a href="" ng-click="navigavm.logout()">Logout</a></li>
                    </ul>
                </li>
    
            </ul>
        </div>
</nav>
~~~~

and implement navigation controller that will check if the user is loged in 
and handle logout as well. 
Do not forget to add navigation controller's implementation to the
minify process in main `app.js` and to declare its and its 
`controllerAs`'s  usage in the `nav.directive.js`

## Restricting access to API access point

We will do so that only logged in user can add comment.
We change `app_client/comments` part of the application.

First things to change are views.

1. add `ng-submit` attribute to the `commentForma` 
form in `comments.view.html`
2. point it to `'vm.newComment()'` (`ng-submit='vm.newComment()'`)
3. attach ng-model's to each inpuit field,
4. as the function is already defined just test it.

Now everyone can add a comment. Let make it available only for loged in users.

1. On the client side, in the `commentsData` service, under `newComment` function, we add
one more parameter
~~~~.js
headers: {
    Authorization: 'Bearer ' + authentication.returnToken()
  }
}
~~~~
2. On the API side, we install `express-jwt` library with `npm install --save express-jwt`
3. On the API side, we add middleware function to 
in `app_api/routes/index.js` when attaching a
route handler `ctrComments.createNew` to its route `'/comments/new'`:
   
  *  Definition: 
~~~~.js
var jwt = require('express-jwt');
var authentication = jwt({
  secret: process.env.JWT_PASS,
  userProperty: 'payload'
});
~~~~
in the `routes/index.js` before controllers' definition.
  * Usage: `router.post('/comments/new', ctrComments.createNew);` line
  becomes `router.post('/comments/new', authentication, ctrComments.createNew);`


