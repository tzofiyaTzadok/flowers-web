var express = require('express');
var router = express.Router();
var router = express.Router({mergeParams: true});
const User = require('../model')("User");

router.get('/', async function(req, res, next) {
	try {
		let us = await  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
		if (!us) {
			res.status(404).send();
			return;
		}
		console.log(us);
		res.render('reset');
	} catch (err) {
		console.log(`Failure ${err}`);
	}
});

module.exports = router;