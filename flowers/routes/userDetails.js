var express = require('express');
var router = express.Router();
const User = require('../model')("User");

/* POST user details. */
router.post('/', async function(req, res, next) {
	if (req.session.username === undefined) {
        res.status(401).send();
		return;
	}
	try {
		let userDetails = await User.findOne({
			username: req.session.username
	    }).exec();
	    userDetails.password = "";
		res.json(userDetails);
	} catch (error) {
        res.status(401).send();
    }
});

module.exports = router;