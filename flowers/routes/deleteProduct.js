var express = require('express');
var router = express.Router();
const Cart = require('../model')("Cart");
const Product = require('../model')("Product");

/* POST delete product. */
router.post('/', async function (req, res, next) {
    // let queryForDelete = Product.findOne({
    //     name: req.body.name,
    //     imageContentType: req.body.imageContentType,
    // 	imageData: req.body.imageData
    // }).exec();
    // let productToDelete, removing;
    try {
        let cart = await Cart.findOneAndUpdate(
            { "user": req.session._id },
            {
                "$pull": { "products": { imageData: req.body.imageData } }
            });
        // [productToDelete] = await Promise.all([queryForDelete]);
        // if (productToDelete) {
        //     removing = productToDelete.remove();
        // } else
        //     console.log(`Can't delete: product does not exist!`);

    } catch (err) {
        console.log(`Failure ${err}`);
    }
    setTimeout((function () {
        res.status(200).send()
    }), 1000);
});

module.exports = router;