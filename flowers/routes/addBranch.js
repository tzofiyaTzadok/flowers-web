var express = require('express');
var router = express.Router();
const Branch = require('../model')("Branch");

/* POST add branch. */
router.post('/', async function(req, res, next) {
	let branch = {
		address: {
			number: req.body.number,
			street: req.body.street,
			city: req.body.city,
			state: req.body.state
		},
		branchNumber: req.body.branchNumber,
		phoneNumber: req.body.phoneNumber,
		active: req.body.active
	};
	result = Branch.create(branch);
	try {
		await result;
        console.log("Branch was added");
    } catch (err) {  console.log("Branch created error") }
	setTimeout((function() {res.status(200).send()}), 1000);
});

module.exports = router;
