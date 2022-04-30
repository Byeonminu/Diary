const shortid = require('shortid');
const { User, Writing, sequelize } = require('../models');




    exports.Home_redirecting = function (req, res, next) {
        return res.redirect('/list/' + req.user[0].identifier);
    }
    exports.Createpage = function (req, res, next) {
        return res.render('create', { nickname: req.user[0].nickname })
    }
    exports.Create_process = async (req, res, next) => { // async await 
        try{
            const user = await Writing.create({
                user_identifier: req.user[0].identifier,
                title: req.body.title,
                description: req.body.description,
                doc_identifier: shortid.generate()
            })
            if(user)
            return res.redirect('/list/' + req.user[0].identifier);
            else
            return res.status(404).send('cannot create page')
        } catch (err){
            console.log(err);
            next(err);
        }
               
    }
    exports.Document_update= async (req, res, next) => {
        try{
            const result = await User.findAll({
                where: { identifier: req.user[0].identifier},
                include: [
                    {
                        model: Writing,
                        where: {
                            doc_identifier: req.params.doc_identifier,
                            
                        },
                        attributes: ['title', 'description', 'doc_identifier', 'user_identifier' ],
                        required: false
                    }
                ],
                attributes: ['nickname']
               
            })
            return res.render('update', { writing: result[0] })
        } catch(err){
            console.log(err);
            next(err);
        }
    }
    exports.Update_process= async (req, res, next) => {
        try{
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
            await Writing.update(value,condition);
            return res.redirect('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
        } catch (err){
            console.log(err);
            next(err);
        }

    }
    exports.Document_delete = async (req, res, next) => {
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
    exports.User_content_page = async (req, res, next) => {
     try{
         const writings = await Writing.findAll({
             where:{
                 user_identifier: req.params.user_identifier
             },
             attributes:['title', 'user_identifier', 'doc_identifier']
         });
         try{
             const result = await User.findAll({
                 where: {identifier: req.user[0].identifier },
                 include: [
                     {
                         model: Writing,
                         where: {
                             doc_identifier: req.params.doc_identifier,
                             user_identifier: req.params.user_identifier
                         },
                         attributes: ['title', 'doc_identifier', 'user_identifier', 'when_written', 'last_updated','description'],
                         required: false
                     }
                 ],
                 attributes: ['nickname']
             });
             if (result !== undefined) {
                 return res.render("content", {
                     contents: result[0],
                     writings: writings
                 });
             }
             else { res.redirect('/home'); }
         } catch(err){
             console.log(err);
             next(err);
         }
     } catch(err2){
         console.log(err2);
         next(err2);
     }
            
    }
    exports.Contents_list_page = async (req, res, next) => {
        console.log('Contents_list_page');
        if (!req.session.isLogined){ // not logined
            console.log("not logined");
            res.redirect('/home');
        }
        else { // islogined
            if (req.session.passport.user === req.params.identifier){
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



    
