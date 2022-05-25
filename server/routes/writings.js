let express = require('express');
let router = express.Router();
const Controller = require('../controllers/controller');



router.get('/new-writings', Controller.Createpage);

router.post('/new-writings', Controller.Create_process);

router.get('/:doc_identifier', Controller.Document_update);

router.put('/:doc_identifier', Controller.Update_process);

router.delete('/:doc_identifier', Controller.Document_delete)

router.get('/:user_identifier/:doc_identifier', Controller.User_content_page);




module.exports = router;
