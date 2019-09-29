var express = require('express');
var router = express.Router();

/* GET nav by category. */
router.get('/', async function(req, res, next) {
    let category = "none";
    if (req.session.category !== undefined) {
        category = req.session.category;
    }
    switch (category) {
        case "manager":
            res.render('partials/manager-nav');
            break;
        case "worker":
            res.render('partials/worker-nav');
            break;
        case "customer":
            res.render('partials/customer-nav');
            break;
        case "supplier":
            res.render('partials/supplier-nav');
            break;
        case "none":
            res.render('partials/un-registered-nav');
            break;
        default:
            res.render('partials/un-registered-nav');
            break;
    }
});

module.exports = router;