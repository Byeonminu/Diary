let express = require('express');
let router = express.Router();
const { User } = require('../../database/models');

router.get('/', function(req, res, next) {
  return res.render('home', {
    message: req.flash().error 
  });
});

module.exports = router;
