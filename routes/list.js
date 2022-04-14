var express = require('express');
var router = express.Router();
const db = require('../config/db');

router.get('/', function(req, res, next) {
  console.log("session", req.user[0].identifier);
  return res.redirect('/list/' + req.user[0].identifier);
  
});

router.get('/:user_identifier/:doc_identifier', function (req, res, next) {
 
  db.query(`select * from writing where user_identifier = ? and doc_identifier = ? `, [req.params.user_identifier, req.params.doc_identifier], function (err, result) {

    if (err) return next(err);

    if (result !== undefined) {
      console.log('result0 is', result);
      res.render("content", { contents: result[0] });
    }
    else {

      res.redirect('/');
    }


  })
});


router.get('/:identifier', function (req, res, next) {
  console.log('asdsad', req.user);
  console.log('idnet', req.params.identifier);
  db.query(`select * from writing where user_identifier = ?`, [req.params.identifier], function(err, result){
    
    if(err) return next(err);
    
    if(result !== undefined){
      console.log(result,'is writing');
      res.render("list", 
      { lists : result,
        nickname : req.user[0].nickname
      });
    }
    else{
      
      res.redirect('/');
    }


  })
});



module.exports = router;
