let express = require('express');
let router = express.Router();
const Controller = require('../controllers/controller');



router.get('/', Controller.Home_redirecting);

router.get('/:identifier', Controller.Contents_list_page);

module.exports = router;
