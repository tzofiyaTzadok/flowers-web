var express = require('express');
var decrypt = require("./decrypt");

var router = express.Router();
const User = require('../model')("User");

router.post('/', async function(req, res, next) {
	try {
		let us = await User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
		if (!us) {
			res.status(404).send();
			return;
		}
		
		await us.setPassword(await decrypt(req.body.password));
        us.resetPasswordToken = undefined;
        us.resetPasswordExpires = undefined;
		
		await us.save();
		res.status(200).send();
	} catch (err) {
		console.log(`Failure ${err}`);
	}
});

module.exports = router;