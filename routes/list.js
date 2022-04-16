var express = require('express');
const shortid = require('shortid');
var router = express.Router();
const db = require('../config/db');




router.get('/', function(req, res, next) {
  
  return res.redirect('/list/' + req.user[0].identifier);
  
});

router.get('/create', function (req, res, next) {
  res.render('create',{
    nickname: req.user[0].nickname
  });
});

router.post('/create_process', function (req, res, next){
  console.log('create_process', req.user[0]);
  db.query(`insert into writing values(?, ?, ?, now(), now(), ?)`, 
  [req.user[0].identifier, req.body.title, req.body.description, shortid.generate()], function(err, result){
    res.redirect('/list/' + req.user[0].identifier);
  });
});

router.get('/update/:doc_identifier', function (req, res, next) {
 
  db.query(`select nickname, user_identifier,
   title, description, doc_identifier from users left join writing 
   on users.identifier = writing.user_identifier where doc_identifier = ?;`, [req.params.doc_identifier], function (err, result) {
    console.log('update is', result);
  
     res.render('update',{
      writing: result[0]
    })
  })
});

router.post('/update_process', function (req, res, next) {
  console.log('req body is ', req.body);
  db.query(`update writing set title = ?, description = ?, last_updated = NOW() where user_identifier = ? and doc_identifier = ?`,
    [req.body.title, req.body.description, req.user[0].identifier, req.body.doc_identifier], function (err, result) {
      console.log(req.body.title, req.body.description, req.user[0].identifier, req.body.doc_identifier);
      console.log('update result is', result);
      if(err) throw(err);
      else return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
    });
});

router.get('/delete/:doc_identifier', function (req, res, next) {

  db.query(`delete from writing where doc_identifier = ?`, [req.params.doc_identifier], function (err, result) {
    res.redirect('/list');
  });
})




router.get('/:user_identifier/:doc_identifier', function (req, res, next) {
 

  db.query(`select * from writing where user_identifier = ?`, [req.params.user_identifier], function (err, user) {
    db.query(`select  nickname, user_identifier, when_written, last_updated,
    title, description, doc_identifier from users left join writing 
    on users.identifier = writing.user_identifier where user_identifier = ? and doc_identifier = ?;`, [req.params.user_identifier, req.params.doc_identifier], function (err, result) {

      if (err) return next(err);
      
      if (result !== undefined) {
        console.log('user' , user);
        res.render("content", {
           contents: result[0],
           user : user });
      }
      else {

        res.redirect('/');
      }


    })
  })
});


router.get('/:identifier', function (req, res, next) {

  req.session.cookie.maxAge = 3600000; //cookie maxAge
  console.log('cookie is ', req.session.cookie);
  
  db.query(`select * from writing where user_identifier = ?`, [req.params.identifier], function(err, result){
    
    if(err) return next(err);
    
    if(result !== undefined){
      
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
