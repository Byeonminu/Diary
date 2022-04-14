const { application } = require('express');
const { use } = require('passport');

module.exports = function(app) {

    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;
    const db = require('../config/db');
    
    const bcrypt = require('bcrypt');

    
    app.use(passport.initialize()); 
    app.use(passport.session());
    
    passport.serializeUser(function(user, done){
        console.log("serializeUser", user[0].identifier);
        done(null, user[0].identifier);
    })

    passport.deserializeUser(function (identifier, done){
        console.log("deserializeUser", identifier);
        db.query(`select * from users where identifier = ?`, [identifier], function(err, user){
            console.log('sdsd', user);
            done(null, user);
        })
    })

    passport.use(new LocalStrategy(
        {
            usernameField: 'user_id',
            passwordField: 'user_pw',
            session: true,
        },
        function (username, pwd, done) {
            const password = bcrypt.hashSync(pwd, 10);
            console.log("pwd is ", pwd);
           
            db.query(`select * from users where id = ? `,[username], function(err, user){
            console.log(user);
            if (err){ return done(err); }
            if (!user){ return done(null, false); }
            if (user){
                    bcrypt.compare(pwd, user[0].password, function(err, result){
                    if(result){
                        
                        console.log("correct!");
                        
                        return done(null, user); 
                    }
                    else{
                        return done(null, false);
                    }
                    
                })
                         
                        
            }
                    
                

            });
           
        }
    ));

    
    return passport;

}