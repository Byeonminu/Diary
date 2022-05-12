const { application } = require('express');
const { use } = require('passport');
const { User, Writing, sequelize, Oauth } = require('../../database/models');
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
            console.log('구글 로그인 ', accessToken, refreshToken, profile);
            try {   
                const already_user = await User.findAll({
                    where : {identifier : profile.id}
                });
                if(already_user.length !== 0){ // user already exist
                    var value = {
                        access_token: accessToken
                    };
                    var condition = {
                        where: {
                            google_user_id: already_user[0].id
                        }
                    };
                    const google_user_update = await Oauth.update(value, condition);
                    if (google_user_update)
                    return cd(null, already_user[0]);
                }
                else{
                    const user = await {
                        identifier: profile.id,
                        nickname: profile.displayName,
                        provider: 'google',
                    }
                    const check_user = await User.create(user);
                    if (check_user){
                        console.log('check_user: ', check_user);
                        const oauth = await {
                            google_user_id: check_user.dataValues.id,
                            refresh_token: refreshToken,
                            access_token: accessToken,
                        }
                        const check_oauth = await Oauth.create(oauth)
                        if (check_oauth) {
                            return cd(null, user);
                        }
                    }
                    
                }
            } catch(err){
                console.log(err);
            }
           
        }
    ));
    
    return passport;

}