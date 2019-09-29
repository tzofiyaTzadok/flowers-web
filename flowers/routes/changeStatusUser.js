var express = require('express');
var router = express.Router();
const User = require('../model')("User");

/* POST change status of user. */
router.post('/', async function(req, res, next) {
    if (req.session.category != "manager"){
        res.status(401).send();
        return;
    }
    let queryForUpdate = User.findOne({
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    }).exec();
    let userToChangeStatus, changingStatus;
    try {
        [userToChangeStatus] = await Promise.all([queryForUpdate]);
        console.log(userToChangeStatus);
        if (userToChangeStatus) {
            console.log(`Changing Status of ${userToChangeStatus.username}`);
            userToChangeStatus.userCategory = req.body.userCategory;
            userToChangeStatus.branchNumber = req.body.branchNumber;
            if (req.body.userCategory == "customer" || req.body.userCategory == "supplier") {
                userToChangeStatus.branchNumber = "null";
            }
            changingStatus = userToChangeStatus.save();
        } else
            console.log(`Can't update status: user does not exist!`);


    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function() {
        res.status(200).send()
    }), 1000);
});

module.exports = router;