var express = require('express');
var router = express.Router();
var ctrlComments = require('../controllers/comments');

/* GET home page. */
router.get('/', ctrlComments.index);

router.post('/new', ctrlComments.newComment);

//search by the name
//get all comments with the certain name
router.get('/search', ctrlComments.getCommentsByName);

router.post('/delete', ctrlComments.deleteById);

module.exports = router;

