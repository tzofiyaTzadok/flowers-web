var express = require('express');
var router = express.Router();
const Flower = require('../model')("Flower");
var flowers = [];

/* GET catalog page. */
router.get('/', async function(req, res, next) {
	if (req.session.category === undefined){
        res.status(401).send();
        return;
    }
    try {
        flowers = await Flower.REQUEST();
    } catch (err) {
        console.log("request error")
    }
    res.render('catalog', {
        title: 'Express',
        flowersArray: flowers
    });
});

module.exports = router;