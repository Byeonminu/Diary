const { use } = require('passport');

module.exports = function(app) {

    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;
    const db = require('../config/db');
    const bcrypt = require('bcrypt');

    passport.serializeUser(function(user, done){
        console.log(user);
        done(null, user.identifier);
    })

    passport.serializeUser(function(identifier, done){
        db.query(`select * from users where identifier = ?`, [identifier], function(err, user){
            done(null, user);
        })
    })

    passport.use(new LocalStrategy(
        {
            usernameField: 'user_id',
            passwordField: 'user_pw'
        },
        function (username, pwd, done) {
            const password = bcrypt.hashSync(pwd, 10);
            db.query(`select * from users where id = ? `,[username], function(err, user){
                console.log(user);
                    if (err){ return done(err); }
                    if (!user){ return done(null, false); }
                    if (user) { return done(null, user); }
                    
                

            });
           
        }
    ));

    
    return passport;

}