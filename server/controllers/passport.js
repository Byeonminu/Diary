const { application } = require('express');
const { use } = require('passport');
const { User, Writing, sequelize } = require('../../database/models');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { identifier } = require('@babel/types');
const e = require('connect-flash');
const credential = require('../../database/config/google.json').web;



module.exports = function(app) {

    
    
    app.use(passport.initialize()); 
    app.use(passport.session());
    
    passport.serializeUser(function(user, done){

        done(null, user.identifier);
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
                            return done(null, user[0]);
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


    passport.use(new GoogleStrategy({
        clientID: credential.client_id,
        clientSecret: credential.client_secret,
        callbackURL: credential.redirect_uris[0],
    },
        async (accessToken, refreshToken, profile, cd)  =>{
            try {   
                const already_user = await User.findAll({
                    where : {identifier : profile.id}
                });
                if(already_user.length !== 0){
                    return cd(null, already_user[0]);
                }
                else{
                    const user = await {
                        user_id: 'google',
                        password: 'google',
                        identifier: profile.id,
                        nickname: profile.displayName,
                    }
                    const check = await User.create(user);
                    if (check) {
                        return cd(null, user);
                    }
                }
            } catch(err){
                console.log(err);
            }
           
        }
    ));
    
    return passport;

}