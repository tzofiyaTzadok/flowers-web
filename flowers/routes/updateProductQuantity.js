var express = require('express');
var router = express.Router();
const Product = require('../model')("Product");
const Cart = require('../model')("Cart");

/* POST update product quantity . */
router.post('/', async function (req, res, next) {
    // let queryForUpdate = Product.findOne({
    //     name: req.body.name,
    //     imageContentType: req.body.imageContentType,
    // 	imageData: req.body.imageData
    // }).exec();
    // let productToUpdateQuantity, changingStatus;
    try {

        let cart = await Cart.findOneAndUpdate(
            { "user": req.session._id, "products.imageData": req.body.imageData },
            {
                "$set": {
                    "products.$.quantity": req.body.quantity
                }
            });
        console.log("changed quantity of product");
        //     [productToUpdateQuantity] = await Promise.all([queryForUpdate]);
        //     console.log(productToUpdateQuantity);
        //     if (productToUpdateQuantity) {
        //         productToUpdateQuantity.quantity = req.body.quantity;
        //         changingStatus = productToUpdateQuantity.save();
        //     } else
        //         console.log(`Can't update quantity: product does not exist!`);


    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function () {
        res.status(200).send()
    }), 1000);
});

module.exports = router;