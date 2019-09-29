var express = require('express');
var router = express.Router();
const User = require('../model')("User");
const passport = require('passport');
var decrypt = require("./decrypt");
var users = [];

router.post('/', async function(req, res, next) {
	req.body.password = await decrypt(req.body.password);
    next();
})

/* POST confirmLogin. */
router.post('/', passport.authenticate('local'), async function(req, res, next) {
    var session = req.session;
    session.username = req.user.username;
    session.category = req.user.userCategory;
    session._id = req.user._id;
    setTimeout((function() {
        res.status(200).send()
    }), 1000);

});

module.exports = router;