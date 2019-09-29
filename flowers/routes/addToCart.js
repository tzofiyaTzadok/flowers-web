var express = require('express');
var router = express.Router();
const Cart = require('../model')("Cart");
const Product = require('../model')("Product");

/* POST add product. */
router.post('/', async function (req, res, next) {
    let product = {
        name: req.body.name,
        imageContentType: req.body.imageContentType,
        imageData: req.body.imageData,
        price: req.body.price,
        quantity: req.body.quantity
    };
    // result = Product.create(product);
    try {
        let cart = await Cart.findOne({ user: req.session._id });
        let newCart = false;
        let minutesDiff = 0;
        if (!cart) {
            cart = await Cart.create({ user: req.session._id });
            newCart = true;
        } else {
            const createDate = new Date(cart.createdAt);
            const diff = Date.now() - createDate;
            minutesDiff = Math.round(diff / 60000);
        }
        if (minutesDiff >= 15 || newCart) {
            cart.products = [product];
            cart.createdAt = Date.now();
        }
        else {
            let newProducts = cart.products;
            newProducts.push(product);
            cart.products = newProducts;
        }
        await cart.save();
        console.log("Product add to cart");
    } catch (err) {
        console.log("Product created error ", err);
    }
    setTimeout((function () {
        res.status(200).send()
    }), 1000);
});

module.exports = router;