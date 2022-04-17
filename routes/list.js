var express = require('express');
var router = express.Router();
const Controller = require('../controllers/controller');



router.get('/', Controller.Home_redirecting);

router.get('/create', Controller.Createpage);

router.post('/create_process',Controller.Create_process);

router.get('/update/:doc_identifier', Controller.Document_update);

router.post('/update_process', Controller.Update_process);

router.get('/delete/:doc_identifier', Controller.Document_delete)

router.get('/:user_identifier/:doc_identifier', Controller.User_content_page);

router.get('/:identifier', Controller.Contents_list_page);





module.exports = router;
