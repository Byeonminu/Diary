const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const db = require('../config/db');
const Controller = require('../controllers/controller');


router.post('/signin',
  passport.authenticate('local', {
     failureRedirect: '/home',
     successRedirect: '/list',
     failureFlash : true,
    })
  );


router.post('/signup', function (req, res, next) {
  console.log(req.body);
  const id = req.body.new_id;
  const password = bcrypt.hashSync(req.body.new_pw1, 10);
  const password_check = bcrypt.hashSync(req.body.new_pw2, 10);
  const identifier = shortid.generate();
  const nickname = req.body.user_name;
  db.query(`select * from users where id = ?`, [id], function (err, id_check) {
    if (err) throw (err);
    if (id_check.length !== 0) { //ID already exists
      req.flash('error', 'ID already exists!');
      return res.redirect('/');
    }
    else {
      if (req.body.new_pw1 !== req.body.new_pw2) { // password double check
        req.flash('error', 'password must be same!');
        return res.redirect('/');
      }
      db.query(`insert into users (id, password, identifier, nickname) values(?, ?, ?, ? )`,
        [id, password, identifier, nickname], function (err, result) {
          if (err) { return next(err); }
          else {
            db.query(`select * from users where identifier = ?`, [identifier], function (err, user) {
              req.login(user, function (err) { // auto login
                if (err) { return next(err); }
                req.session.identifier = user[0].identifier;
                return res.redirect('/list/' + user[0].identifier);
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
    res.redirect('/');
  });
 
});

module.exports = router;
