var express = require('express');
var router = express.Router();
const Branch = require('../model')("Branch");
var branches = [];

/* GET branches listing. */
router.get('/', async function(req, res, next) {
    try {
        branches = await Branch.REQUEST();
    } catch (err) {
        console.log("request error")
    }
    let branchNumbers = [];
    branches.forEach(function(branch) {
        if (branch.active) {
            branchNumbers.push(branch.branchNumber);
        }
    });
    res.json(branchNumbers);
});

module.exports = router;