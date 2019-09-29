var express = require('express');
var router = express.Router();
const User = require('../model')("User");
var decrypt = require("./decrypt");

/* POST add user. */
router.post('/', async function(req, res, next) {
	let user = {
		username: req.body.userName,
		name: {
			firstName: req.body.firstName,
			lastName: req.body.LastName
		},
		address: {
			streetAddress: req.body.streetAndNumber,
			city: req.body.city,
			state: req.body.state
		},
		phoneNumber: req.body.phoneNumber,
		mailAddress: req.body.mailAddress,
		userCategory: req.body.userCategory,
		branchNumber: req.body.branchNumber
	};
	if (!(((req.session.username === undefined || req.session.category == "worker")
		&& user.userCategory == "customer")
		|| req.session.category == "manager")) {
		res.status(401).send();
		return;
	}
	
	try {
		result = await User.register(new User(user), await decrypt(req.body.password))
        console.log("User created");
        } catch (err) {  console.log("User created error") }
	setTimeout((function() {res.status(200).send()}), 1000);
});

module.exports = router;
