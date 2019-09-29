var express = require('express');
var router = express.Router();
const Product = require('../model')("Product");
const Cart = require('../model')("Cart");

/* POST empty the user cart. */
router.post('/', async function (req, res, next) {
    try {

        let cart = await Cart.findOneAndUpdate(
            { "user": req.session._id },
            {
                "$set": {
                    "products": []
                }
            });
        console.log("changed quantity of product");
    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function () {
        res.status(200).send()
    }), 1000);
});

module.exports = router;