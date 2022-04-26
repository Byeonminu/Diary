const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const db = require('../config/db');
const Controller = require('../controllers/controller');


router.post('/signin', passport.authenticate('local', {
     failureRedirect: '/',
     failureFlash : true, 
  }),
  function (req, res) { // success login, save session -> redirect
    req.session.isLogined = true
    req.session.save(function () {
      res.redirect('/list');
    });
  });



router.post('/signup', function (req, res, next) {
  console.log(req.body);
  const user_id = req.body.new_id;
  const password = bcrypt.hashSync(req.body.new_pw1, 10);
  const password_check = bcrypt.hashSync(req.body.new_pw2, 10);
  const identifier = shortid.generate();
  const nickname = req.body.user_name;
  db.query(`select * from users where user_id = ?`, [user_id], function (err, id_check) {
    if (err) throw (err);
    if (id_check.length !== 0) { //ID already exists
      console.log('ID already exists!');
      req.flash('error', '이미 존재하는 아이디입니다.');
      return res.redirect('/');
    }
    else {
      if (req.body.new_pw1 !== req.body.new_pw2) { // password double check
        console.log('password must be same!');
        req.flash('error', '비밀번호가 다릅니다.');
        return res.redirect('/');
      }
      db.query(`insert into users (user_id, password, identifier, nickname) values(?, ?, ?, ? )`,
        [user_id, password, identifier, nickname], function (err, result) {
          if (err) { return next(err); }
          else {
            db.query(`select * from users where identifier = ?`, [identifier], function (err, user) {
              req.login(user, function (err) { // auto login
                if (err) { return next(err); }
                req.session.identifier = user[0].identifier;
                req.session.isLogined = true;
                req.session.save(function (){
                  return res.redirect('/list/' + user[0].identifier);
                })
              });
            })
          }
        })
    }
  })
});

router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy(err =>{
    res.redirect('/home');
  });
 
});

module.exports = router;
