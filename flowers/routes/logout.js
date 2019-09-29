var express = require('express');
var router = express.Router();

/* POST confirmLogin. */
router.post('/', async (req,res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        }
    });
});

module.exports = router;