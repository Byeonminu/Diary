const user = require('../config/db');
 




user.query(`delete from writing where doc_identifier = ?`, [req.params.doc_identifier], function (err, result){

    if(err){
        result(err,null);
        return;
    }    
    else{
        result(null);
        return;
    }

})

