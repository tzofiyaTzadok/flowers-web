var express = require('express');
var router = express.Router();
const User = require('../model')("User");
var users = [];

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try {
        users = await User.REQUEST();
    } catch (err) {
        console.log("request error")
    }
    console.log("users")
    console.log(req.session)
    let category = "none";
    if (req.session.category !== undefined) {
        category = req.session.category;
    }
    console.log(category)


    switch (category) {
        case "manager":
            res.render('manager-users', {
                userCategory: category,
                usersArray: users
            });
            break;
        case "worker":
            var customers = [];
            users.forEach(function(user) {
                if (user.userCategory == "customer")
                    customers.push(user);
            })
            res.render('worker-users', {
                userCategory: category,
                usersArray: customers
            });
            break;
        default:
            res.render('worker-users', {
                userCategory: category,
                usersArray: []
            });
            break;
    }
});

module.exports = router;