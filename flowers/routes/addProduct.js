var express = require('express');
var router = express.Router();
const Product = require('../model')("Product");

/* POST add product. */
router.post('/', async function(req, res, next) {
    let product = {
        name: req.body.name,
        imageContentType: req.body.imageContentType,
        imageData: req.body.imageData,
        price: req.body.price,
		quantity: req.body.quantity
    };
    result = Product.create(product);
    try {
        await result;
        console.log("Product created");
    } catch (err) {
        console.log("Product created error")
    }
    setTimeout((function() {
        res.status(200).send()
    }), 1000);
});

module.exports = router;