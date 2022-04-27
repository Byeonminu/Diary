const { application } = require('express');
const { use } = require('passport');
const { User, Writing, sequelize } = require('../models');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const db = require('../config/db');
const bcrypt = require('bcrypt');



module.exports = function(app) {

    
    
    app.use(passport.initialize()); 
    app.use(passport.session());
    
    passport.serializeUser(function(user, done){
        
        done(null, user[0].identifier);
    })
    
    passport.deserializeUser(async (identifier, done) => {
        
        try{
            const user = await User.findAll({
                where: {
                    identifier: identifier
                }
            })
          return done(null, user); // req.user
        } catch(err){
            console.log(err);
            next(err);
        }

    })

    passport.use(new LocalStrategy(
        {
            usernameField: 'user_id',
            passwordField: 'user_pw',
            session: true,

        },
        async (username, pwd, done) => {
            const password = bcrypt.hashSync(pwd, 10);
        
            try{
                const user = await User.findAll({
                    where: {
                        user_id: username
                    }
                });
                if (!user.length) {
                    console.log('There is no ID!')
                    return done(null, false, { message: '존재하지 않는 아이디입니다.' })
                }
                if (user) {
                    bcrypt.compare(pwd, user[0].password, function (err, result) {
                        if (result) { // login success

                            console.log("correct!");
                            return done(null, user);
                        }
                        else { //login fail
                            console.log('Password is not correct!')
                            return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                        }
                    })
                }
            } catch(err){
                console.log(err);
                next(err);
            }           
        }
    ));

    
    return passport;

}