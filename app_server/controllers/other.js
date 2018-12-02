/* Vrni začetno stran s seznamom lokacij */
var dataJSON = require('../models/commentsAdmin.json');

module.exports.index = function(req, res) {
  res.render('index', dataJSON);
};