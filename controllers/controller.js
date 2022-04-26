const db = require('../config/db');
const shortid = require('shortid');
const { User, Writing, sequelize } = require('../models');



    exports.Home_redirecting = function (req, res, next) {
        // console.log('user, home redirecting', req.user[0]);
        return res.redirect('/list/' + req.user[0].identifier);
    }
    exports.Createpage = function (req, res, next) {
        return res.render('create', { nickname: req.user[0].nickname })
    }
    exports.Create_process = async (req, res, next) => { // async await 
        // db.query(`insert into writing (user_identifier, title, description, when_written, last_updated, doc_identifier) 
        // values(?, ?, ?, now(), now(), ?)`,
        // [req.user[0].identifier, req.body.title, req.body.description, shortid.generate()], function (err, result) {
        //     res.redirect('/list/' + req.user[0].identifier); })
        try{
            await Writing.create({
                user_identifier: req.user[0].identifier,
                title: req.body.title,
                description: req.body.description,
                doc_identifier: shortid.generate()
            })
            return res.redirect('/list/' + req.user[0].identifier);
        } catch (err){
            console.log(err);
            next(err);
        }
       
        
        
    }
    exports.Document_update= async (req, res, next) => {
     db.query(`select nickname, user_identifier,title, description, doc_identifier 
     from users left join writing on users.identifier = writing.user_identifier where doc_identifier = ?;`, 
     [req.params.doc_identifier], function (err, result) {
       res.render('update', { writing: result[0] })
        })
    
        // try{
        //     const result = await User.findAll({
        //         //  where: { identifier: req.user[0],identifier},
        //         include: [
        //             {
        //                 model: Writing,
        //                 where: {
        //                     doc_identifier: req.params.doc_identifier,
                            
        //                 },
        //                 attributes: ['title', 'description', 'doc_identifier', 'user_identifier' ],
        //                 required: false
        //             }
        //         ],
        //         attributes: ['nickname']
               
        //     })
        //     console.log('update_info', result);

        //     res.render('update', { writing: result[0] })
        // } catch(err){
        //     console.log(err);
        //     next(err);
        // }
    }
    exports.Update_process= async (req, res, next) => {
    // db.query(`update writing set title = ?, description = ?, last_updated = NOW() where user_identifier = ? and doc_identifier = ?`,
    //     [req.body.title, req.body.description, req.user[0].identifier, req.body.doc_identifier], function (err, result) {
    //         if (err) throw (err);
    //         else return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
    //     });
        var value = {
            title: req.body.title,
            description: req.body.description,
            last_updated: sequelize.literal('CURRENT_TIMESTAMP')
        };
        var condition = {
            where: {
                user_identifier: req.user[0].identifier,
                doc_identifier: req.body.doc_identifier
            }
        };
        try{
            await Writing.update(value,condition);
            return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
        } catch (err){
            console.log(err);
            next(err);
        }

    }
    exports.Document_delete = async (req, res, next) => {
        // db.query(`delete from writing where doc_identifier = ?`, [req.params.doc_identifier], function (err, result) {
        //     res.redirect('/list');
        // });
        try{
            await Writing.destroy({
                where: { doc_identifier: req.params.doc_identifier }
            });
            return res.redirect('/list');
        } catch(err){
            console.log(err);
            next(err);
        }
       
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
    exports.Contents_list_page = async (req, res, next) => {
        console.log('Contents_list_page');
        if (!req.session.isLogined){ // not logined
            console.log("not logined");
            res.redirect('/home');
        }
        else { // islogined
            if (req.session.passport.user === req.params.identifier){
                // db.query(`select * from writing where user_identifier = ?`, [req.params.identifier], function (err, result) {
                //     if (err) return next(err);
                //     if (result !== undefined) {
                //         res.render("list",
                //             {
                //                 lists: result,
                //                 nickname: req.user[0].nickname
                //             });
                //     }
                //     else { res.redirect('/home'); }
                // })
                 try {
                    const page_list = await Writing.findAll({
                        where : {
                            user_identifier: req.params.identifier
                        }
                    });
                        return res.render("list",
                            {
                                lists: page_list,
                                nickname: req.user[0].nickname
                            });
                     } catch(err){
                         console.log(err);
                         next(err);
                     }
            }
            else{ 
                console.log('you cannot enter other peoples diary');
                res.redirect('/list');
            }
        }
    }



    
