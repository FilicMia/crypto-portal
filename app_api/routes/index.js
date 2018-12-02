var express = require('express');
var router = express.Router();
var ctrComments = require('../controllers/comments');

/* Comments */
router.get('/comments', ctrComments.getAll);

router.post('/comments/new', ctrComments.createNew);

router.get('/comments/search', ctrComments.getCommentsByName);

router.delete('/comments/:idComment', ctrComments.deleteCommentById);

/* Other */
//for now none

module.exports = router;