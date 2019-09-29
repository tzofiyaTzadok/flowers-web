var express = require('express');
var router = express.Router();
const User = require('../model')("User");

/* POST delete user. */
router.post('/', async function(req, res, next) {
    let queryForDelete = User.findOne({
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    }).exec();
    let userToDelete, removing;
    try {
        [userToDelete] = await Promise.all([queryForDelete]);
        if (userToDelete) {
            if (!((req.session.category == "worker" && userToDelete.userCategory == "customer")
                || req.session.category == "manager")) {
                res.status(401).send();
                return;
            }
            console.log(`Deleting user ${userToDelete.username}`);
            removing = userToDelete.remove();
        } else
            console.log(`Can't delete: user does not exist!`);

    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function() {
        res.status(200).send()
    }), 1000);
});

module.exports = router;