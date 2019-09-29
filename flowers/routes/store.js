var express = require('express');
var router = express.Router();
const Flower = require('../model')("Flower");
const Cart = require('../model')("Cart");
const Product = require('../model')("Product");
var flowers = [];
var products = [];
var total;

/* GET store page. */
router.get('/', async function (req, res, next) {
    if (req.session.category === undefined) {
        res.status(401).send();
        return;
    }
    try {
        flowers = await Flower.REQUEST();
        userCart = await Cart.findOne({ user: req.session._id });
        if (userCart) {
            const diff = Date.now() - Date.parse(userCart.createdAt);
            minutesDiff = Math.round(diff / 60000);
            if (minutesDiff >= 15) {
                userCart.products = [];
                userCart.createdAt = Date.now();
                await userCart.save();
            }
            else {
                products = userCart.products;
            }
        } else {
            products = [];
        }

        total = 0;
        for (var i = 0; i < products.length; i++) {
            total = total + (products[i].quantity * products[i].price);
        }
    } catch (err) {
        console.log("request error")
    }
    res.render('store', {
        title: 'Express',
        flowersArray: flowers,
        productsArray: products,
        total: total
    });
});

module.exports = router;
