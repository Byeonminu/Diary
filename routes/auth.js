const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');


router.post('/signin',
  passport.authenticate('local', {
     failureRedirect: '/home',
     successRedirect: '/list',
     
    }),
  function (req, res) {
   
  });


router.post('/signup', function(req, res, next){
  console.log('signup');
  const id = req.body.new_id;
  const password = bcrypt.hashSync(req.body.new_pw1, 10);
  const nickname = req.body.user_name;
  
 
  db.query(`insert into users (id, password, identifier, nickname) values(?, ?, ?, ? )`,
    [id, password, shortid.generate(), nickname], function(err, result){

      res.render('home');


  })


})

module.exports = router;
