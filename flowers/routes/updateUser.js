var decrypt = require("./decrypt");
var express = require('express');
var router = express.Router();
const User = require('../model')("User");

/* POST delete user. */
router.post('/', async function(req, res, next) {
    let queryForUpdate = User.findOne({
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
    }).exec();
    let userToUpdate;
    try {
        [userToUpdate] = await Promise.all([queryForUpdate]);
        console.log(userToUpdate);
        if (userToUpdate) {
            let self_modification = (req.session.username == userToUpdate.username);
            if (!(self_modification 
                || (req.session.category == "worker" && userToUpdate.userCategory == "customer")
                || req.session.category == "manager")) {
                res.status(401).send();
                return;
            }
            console.log(`Changing Status of ${userToUpdate.username}`);
            userToUpdate.username = req.body.userName;
            console.log(await decrypt(req.body.password));
            await userToUpdate.setPassword(await decrypt(req.body.password));
            userToUpdate.address = {
                streetAddress: req.body.streetAndNumber,
                city: req.body.city,
                state: req.body.state
            };
            userToUpdate.phoneNumber = req.body.phoneNumber;
            userToUpdate.mailAddress = req.body.mailAddress;
            userToUpdate.save();
            if (self_modification) {
                req.session.username = userToUpdate.username;
            }
        } else
            console.log(`Can't update user: user does not exist!`);


    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function() {
        res.status(200).send()
    }), 1000);
});

module.exports = router;