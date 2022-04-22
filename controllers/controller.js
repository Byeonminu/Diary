const db = require('../config/db');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { User, Writing } = require('../models');


    exports.Home_redirecting = function (req, res, next) {
        console.log('user, home redirecting', req.user[0]);
        return res.redirect('/list/' + req.user[0].identifier);
    }
    exports.Createpage = function (req, res, next) {
        return res.render('create', { nickname: req.user[0].nickname })
    }
    exports.Create_process = function (req, res, next) {
        // db.query(`insert into writing (user_identifier, title, description, when_written, last_updated, doc_identifier) 
        // values(?, ?, ?, now(), now(), ?)`,
        // [req.user[0].identifier, req.body.title, req.body.description, shortid.generate()], function (err, result) {
        //     res.redirect('/list/' + req.user[0].identifier); })

        Writing.create({
            user_identifier: req.user[0].identifier,
            title: req.body.title,
            description: req.body.description,
            doc_identifier: shortid.generate()
        });
        res.redirect('/list/' + req.user[0].identifier);
        
    }
    exports.Document_update= function (req, res, next) {
     db.query(`select nickname, user_identifier,title, description, doc_identifier 
     from users left join writing on users.identifier = writing.user_identifier where doc_identifier = ?;`, 
     [req.params.doc_identifier], function (err, result) {
            res.render('update', {writing: result[0]})
        })
    }
    exports.Update_process= function (req, res, next) {
    db.query(`update writing set title = ?, description = ?, last_updated = NOW() where user_identifier = ? and doc_identifier = ?`,
        [req.body.title, req.body.description, req.user[0].identifier, req.body.doc_identifier], function (err, result) {
            if (err) throw (err);
            else return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
        });
    }
    exports.Document_delete = function (req, res, next) {
        db.query(`delete from writing where doc_identifier = ?`, [req.params.doc_identifier], function (err, result) {
            res.redirect('/list');
        });
    }
    exports.User_content_page =function (req, res, next) {
     db.query(`select * from writing where user_identifier = ?`, [req.params.user_identifier], function (err, user) {
    
        db.query(`select  nickname, user_identifier, when_written, last_updated,
        title, description, doc_identifier from users left join writing 
        on users.identifier = writing.user_identifier where user_identifier = ? and doc_identifier = ?;`, 
        [req.params.user_identifier, req.params.doc_identifier], function (err, result) {
                    if (err) return next(err);
                    if (result !== undefined) {
                       
                        res.render("content", {
                            contents: result[0],
                            user: user
                        });
                    }
                    else {res.redirect('/home');}
                })
            })
    }
    exports.Contents_list_page = function (req, res, next) {
        console.log('Contents_list_page');
    
        if (!req.session.isLogined){ // not logined
            console.log("not logined");
            res.redirect('/home');
        }
        else { // islogined
          
            if (req.session.passport.user === req.params.identifier){
                db.query(`select * from writing where user_identifier = ?`, [req.params.identifier], function (err, result) {
                    if (err) return next(err);
                    if (result !== undefined) {
                        res.render("list",
                            {
                                lists: result,
                                nickname: req.user[0].nickname
                            });
                    }
                    else { res.redirect('/home'); }
                })
            }
            else{ 
                console.log('you cannot enter other peoples diary');
                res.redirect('/list');
            }
        }
    }



    
