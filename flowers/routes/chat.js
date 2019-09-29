var express = require('express');
const Message = require('../model')("Message");
var router = express.Router();

/* GET about page. */
router.get('/', async function(req, res, next) {
	if (req.session.category === undefined){
        res.status(401).send();
        return;
    }
	try {
        messages = await Message.REQUEST();
    } catch (err) {
        console.log("request error")
    }

    messages.reverse();
  	res.render('chat', { title: 'chat', user_name : req.session.username, messages : messages });
});

module.exports = router;
