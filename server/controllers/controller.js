const shortid = require('shortid');
const { User, Writing, sequelize } = require('../../database/models');
const {google} = require('googleapis');
const credential = require('../../database/config/google.json').web;


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
            if(result) 
            return res.render('update', { writing: result[0] })
            else
            return res.status(404).send('cannot fetch update page')
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
            const result = await Writing.update(value,condition);
            if(result)
                return res.redirect('/writings/' + req.user[0].identifier + '/' + req.body.doc_identifier);
            else
            return res.status(404).send('cannot update page');
        } catch (err){
            console.log(err);
            next(err);
        }

    }
    exports.Document_delete = async (req, res, next) => {
        try{
            const result = await Writing.destroy({
                where: { doc_identifier: req.params.doc_identifier }
            });
            if(result)
            return res.redirect('/list');
            else
            return res.status(404).send('cannot delete page');
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
         if(writings){
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
                if (result) {
                    return res.render("content", {
                        contents: result[0],
                        writings: writings
                    });
                }
                else { return res.redirect('/home'); }
            } catch(err){
                console.log(err);
                next(err);
            }
        }
        else { return res.redirect('/home');}
     } catch(err2){
         console.log(err2);
         next(err2);
     }
            
    }
    exports.Contents_list_page = async (req, res, next) => {
        console.log('Contents_list_page');
        if (!req.session.isLogined){ // not logined
            console.log("not logined");
            return res.redirect('/home');
        }
        else { // islogined
            if (req.session.passport.user === req.params.identifier){
                 try {
                    const page_list = await Writing.findAll({
                        where : {
                            user_identifier: req.params.identifier
                        }
                    });
                    if(page_list)
                    return res.render("list",
                            {
                                lists: page_list,
                                nickname: req.user[0].nickname
                            });
                     else 
                     return res.status(404).send('cannot fetch contents list page')
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
    exports.Calendar_page = async (request, response, next) => {
        
        const { client_secret, client_id, redirect_uris } = credential;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
    
        try{
            const access_token = await User.findAll({
            where:{
               user_id:'google'
            }
        })
        if(access_token.length != 0){
            oAuth2Client.setCredentials({access_token:access_token[0].password});
            console.log("oAuth2Client : ", oAuth2Client);
            const calendar = google.calendar({version: "v3" , auth: oAuth2Client});
            calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const events = res.data.items;
                if (events.length) {
                    console.log('Upcoming 10 events:');
                    let k = events.length;
                    while(k > 0){ 
                        events.map((event, i) => {
                            const start = event.start.dateTime || event.start.date;
                            console.log(`${start} - ${event.summary}`);
                            k -= 1;
                        });
                    }
                    return response.send('끝');
                } else {
                    console.log('No upcoming events found.');
                }
            });
        }
    } catch(err){
        console.log(err);
        next(err);
    }
        
}
    
