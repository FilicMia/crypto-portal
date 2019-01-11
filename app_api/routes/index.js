var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var authentication = jwt({
  secret: process.env.JWT_PASS,
  userProperty: 'payload'
});

var ctrComments = require('../controllers/comments');
var ctrlUsers = require('../controllers/users');
var ctrlAuthentication = require('../controllers/authentication');

/* Comments */
router.get('/comments', ctrComments.getAll);
router.post('/comments/new', authentication, ctrComments.createNew);
router.post('/comments/edit/:idComment', authentication,
                ctrComments.editComment);
router.get('/comments/:idComment', ctrComments.getCommentById);
router.get('/comments/search', ctrComments.getCommentByName);
router.delete('/comments/:idComment', authentication,
        ctrComments.deleteCommentById);

/* User */
router.get('/users', authentication, ctrlUsers.getAll);
router.get('/users/:idUser', authentication, ctrlUsers.getUserById);
router.delete('/users/:idUser', authentication, ctrlUsers.deleteUserById);

/* Authentication */
router.post('/login', ctrlAuthentication.login);
router.post('/registration',
                ctrlAuthentication.register);
                
module.exports = router;