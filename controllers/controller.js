const db = require('../config/db');
const shortid = require('shortid');

module.exports ={
    Home_redirecting: function (req, res, next) {
        return res.redirect('/list/' + req.user[0].identifier);
    },
    Createpage: function (req, res, next) {
        return res.render('create', { nickname: req.user[0].nicknam })
    },
    Create_process: function (req, res, next) {
        console.log('create_process', req.user[0]);
        db.query(`insert into writing values(?, ?, ?, now(), now(), ?)`,
        [req.user[0].identifier, req.body.title, req.body.description, shortid.generate()], function (err, result) {
        res.redirect('/list/' + req.user[0].identifier); })
    },
    Document_update: function (req, res, next) {
     db.query(`select nickname, user_identifier,title, description, doc_identifier 
     from users left join writing on users.identifier = writing.user_identifier where doc_identifier = ?;`, 
     [req.params.doc_identifier], function (err, result) {
            res.render('update', {writing: result[0]})
        })
    },
    Update_process: function (req, res, next) {
    db.query(`update writing set title = ?, description = ?, last_updated = NOW() where user_identifier = ? and doc_identifier = ?`,
        [req.body.title, req.body.description, req.user[0].identifier, req.body.doc_identifier], function (err, result) {
            if (err) throw (err);
            else return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
        });
    },
    Document_delete: function (req, res, next) {
        db.query(`delete from writing where doc_identifier = ?`, [req.params.doc_identifier], function (err, result) {
            res.redirect('/list');
        });
    },
    User_content_page: function (req, res, next) {
     db.query(`select * from writing where user_identifier = ?`, [req.params.user_identifier], function (err, user) {
    
        db.query(`select  nickname, user_identifier, when_written, last_updated,
        title, description, doc_identifier from users left join writing 
        on users.identifier = writing.user_identifier where user_identifier = ? and doc_identifier = ?;`, 
        [req.params.user_identifier, req.params.doc_identifier], function (err, result) {
                    if (err) return next(err);
                    if (result !== undefined) {
                        console.log('user', user);
                        res.render("content", {
                            contents: result[0],
                            user: user
                        });
                    }
                    else {res.redirect('/');}
                })
            })
    },
    Contents_list_page: function (req, res, next) {
        req.session.cookie.maxAge = 3600000; //cookie maxAge
        db.query(`select * from writing where user_identifier = ?`, [req.params.identifier], function (err, result) {
            if (err) return next(err);
            if (result !== undefined) {
                res.render("list",
                    {
                        lists: result,
                        nickname: req.user[0].nickname
                    });
            }
            else { res.redirect('/');}
        })
    }
}