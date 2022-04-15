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
  const password_check = bcrypt.hashSync(req.body.new_pw2, 10);
  const identifier = shortid.generate();
  const nickname = req.body.user_name;
 
  if (req.body.new_pw1 !== req.body.new_pw2){
    
    return res.redirect('/');
    
  }

 
  db.query(`insert into users (id, password, identifier, nickname) values(?, ?, ?, ? )`,
    [id, password, identifier, nickname], function(err, result){

        console.log('qkfh fhrmdls ', result);
        if (err) { return next(err); }
        else{
          
            return res.redirect('/');
        
        }
        
      
  })

})

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
