var express = require('express');
var router = express.Router();
var fs = require('fs');
const Flower = require('../model')("Flower");
var multer = require('multer');
var upload = multer({
    dest: 'uploads/'
});
const image2base64 = require('image-to-base64');

router.post('/', upload.single('imageFlower'), function(req, res, next) {
    if (req.body.fileOrLink == "file") {
        var img = fs.readFileSync(req.file.path);
        req.body.imageContentType = req.file.mimetype;
        req.body.imageData = img.toString('base64');
    }
    next();
})

router.post('/', async function(req, res, next) {
    if (req.body.fileOrLink == "url") {
        req.body.imageContentType = "image/png";
        await image2base64(req.body.imageLinkFlower)
            .then((response) => {
                // console.log(response);
                req.body.imageData = response;
            })
            .catch((error) => {
                console.log("error"); //Exepection error....
            })
    }
    next();
})

/* POST add flower. */
router.post('/', async function(req, res, next) {
    if (req.session.category != "supplier"){
        res.status(401).send();
        return;
    }

    let flower = {
        name: req.body.nameFlower,
        color: req.body.colorFlower,
        imageContentType: req.body.imageContentType,
        imageData: req.body.imageData,
        price: req.body.priceFlower
    };
    result = Flower.create(flower);
    try {
        await result;
        console.log("Flower created");
    } catch (err) {
        console.log("Flower created error")
    }
    setTimeout((function() {
        res.status(200).send()
    }), 1000);
});

module.exports = router;