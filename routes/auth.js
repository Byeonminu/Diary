const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const Controller = require('../controllers/controller');
const { User, Writing, sequelize } = require('../models');


router.post('/signin', passport.authenticate('local', {
     failureRedirect: '/',
     failureFlash : true, 
  }),
  function (req, res) { // success login, save session -> redirect
    req.session.isLogined = true
    req.session.save(function () {
      return res.redirect('/list');
    });
  });



router.post('/signup', async (req, res, next) => {
  const user_id = req.body.new_id;
  const password = bcrypt.hashSync(req.body.new_pw1, 10);
  const password_check = bcrypt.hashSync(req.body.new_pw2, 10);
  const identifier = shortid.generate();
  const nickname = req.body.user_name;
  
  try{
      const id_check = await User.findAll({
        where : {
          user_id: user_id
        }
      });

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

        try{
              await User.create({ 
                user_id: user_id, 
                password: password, 
                identifier: identifier, 
                nickname: nickname, 
            });
              try{
                    const user = await User.findAll({
                        where: {
                        identifier: identifier
                        }
                    });
                    req.login(user, function (err) { // auto login
                      if (err) { return next(err); }
                      req.session.identifier = user[0].identifier;
                      req.session.isLogined = true;
                      req.session.save(function () {
                        return res.redirect('/list/' + user[0].identifier);
                      })
                    });
                } catch(err){
                  console.log(err);
                  next(err);
              }
        
        } catch(err){
          console.log(err);
          next(err);
      }
    }
  } catch(err){
    console.log(err);
    next(err);
  }

});

router.get('/logout', function (req, res) {
  req.logout();
  req.session.destroy(err =>{
    return res.redirect('/home');
  });
 
});

module.exports = router;
