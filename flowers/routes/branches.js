var express = require('express');
var router = express.Router();
const Branch = require('../model')("Branch");
var branches = [];

/* GET branches listing. */
router.get('/', async function(req, res, next) {
	if (req.session.category != "manager") {
		res.status(401).send();
        return;
	}

    try {
        branches = await Branch.REQUEST();
    } catch (err) {
        console.log("request error")
    }
	console.log(branches.length);
	res.render('branches', {
                branchesArray: branches
            });
});

module.exports = router;
