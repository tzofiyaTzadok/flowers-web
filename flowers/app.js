var createError = require('http-errors');
let debug = require('debug')('flowers:app')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let path = require('path');
let express = require('express');
let app = express();
var bodyParser = require('body-parser');
let mongoose = require('mongoose'); // add mongoose for MongoDB access
let session = require('express-session'); // add session management module
let connectMongo = require('connect-mongo'); // add session store implementation for MongoDB
var favicon = require('serve-favicon');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



(async() => {
    let secret = 'lab7 users secret'; // must be the same one for cookie parser and for session

    app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
    app.use(bodyParser.json({ type: 'application/json' }))


    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(secret));

    let MongoStore = connectMongo(session);
    let sessConnStr = "mongodb://localhost/flowers";
    let sessionConnect = mongoose.createConnection();
    try {
        await sessionConnect.openUri(sessConnStr);
    } catch (err) {
        debug(`Error connecting to session backend DB: ${err}`);
        process.exit(0);
    }
    process.on('SIGINT', async() => {
        await sessionConnect.close();
        process.exit(0);
    });

    app.use(session({
        secret: secret, // the secret for signing the session ID cookie
        resave: false, // resave unchanged session? (only if touch does not work)
        saveUninitialized: false, // do we need to save an 'empty' session object?
        rolling: true, // do we send the session ID cookie with each response?
        store: new MongoStore({
            mongooseConnection: sessionConnect
        }), // session storage backend
        cookie: {
            maxAge: 900000,
            httpOnly: true,
            sameSite: true
        } // cookie parameters
        // NB: maxAge is used for session object expiry setting in the storage backend as well
    }));

    // Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());


    app.all('/*', async (req, res, next) => {
        debug('headers');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
        next();
    });

    var indexRouter = require('./routes/index');
    var aboutRouter = require('./routes/about');
    var navRouter = require('./routes/nav');
    var contactRouter = require('./routes/contact');
	var storeRouter = require('./routes/store');
    var usersRouter = require('./routes/users');
    var catalogRouter = require('./routes/catalog');
    var branchesRouter = require('./routes/branches');
    var confirmLoginRouter = require('./routes/confirmLogin');
    var addBranchRouter = require('./routes/addBranch');
    var addUserRouter = require('./routes/addUser');
    var deleteUserRouter = require('./routes/deleteUser');
    var updateUserRouter = require('./routes/updateUser');
    var changeStatusUserRouter = require('./routes/changeStatusUser');
    var branchNumberForBRouter = require('./routes/branchNumbersForB');
    var branchNumberForURouter = require('./routes/branchNumbersForU');
    var addFlowerRouter = require('./routes/addFlower');
	var addProductRouter = require('./routes/addProduct');
    var logoutRouter = require('./routes/logout');
	var userDetailsRouter = require('./routes/userDetails');
	var forgotPasswordRouter = require('./routes/forgotPassword');
	var resetPasswordRouter = require('./routes/resetPassword');
	var chatRouter = require('./routes/chat');
	var updatePasswordRouter = require('./routes/updatePassword');
	var updateProductQuantity = require('./routes/updateProductQuantity');
	var deleteProduct = require('./routes/deleteProduct');
	var addToCart = require('./routes/addToCart');
	var emptyCart = require('./routes/emptyCart');


    app.use('/', indexRouter);
    app.use('/about', aboutRouter);
    app.use('/nav', navRouter);
    app.use('/contact', contactRouter);
	app.use('/store', storeRouter);
    app.use('/users', usersRouter);
    app.use('/catalog', catalogRouter);
    app.use('/confirmLogin', confirmLoginRouter);
    app.use('/branches', branchesRouter);
    app.use('/addBranch', addBranchRouter);
    app.use('/addUser', addUserRouter);
    app.use('/deleteUser', deleteUserRouter);
    app.use('/updateUser', updateUserRouter);
    app.use('/changeStatusUser', changeStatusUserRouter);
    app.use('/branchNumbersForB', branchNumberForBRouter);
    app.use('/branchNumbersForU', branchNumberForURouter);
    app.use('/addFlower', addFlowerRouter);
	app.use('/addProduct', addProductRouter);
    app.use('/logout', logoutRouter);
	app.use('/userDetails', userDetailsRouter);
	app.use('/forgotPassword', forgotPasswordRouter);
	app.use('/reset/:token', resetPasswordRouter);
	app.use('/chat', chatRouter);
	app.use('/updatePassword', updatePasswordRouter);
	app.use('/updateProductQuantity', updateProductQuantity);
	app.use('/deleteProduct', deleteProduct);
	app.use('/emptyCart', emptyCart);
	app.use('/addToCart', addToCart);

    app.use(function(req, res, next) {
      next(createError(404));
    });

    app.use(function(err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(err.status || 500);
      res.render('error');
    });

    var users = [];
    var branches = [];
    var flowers = [];
	var products = [];

    const User = require('./model')("User");
    const Branch = require('./model')("Branch");
    const Flower = require('./model')("Flower");
	const Product = require('./model')("Product");
	
    // Configure passport-local to use account model for authentication
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


        /*try {
            let user = {
                username: 'marva',
                name: {
                    firstName: 'marva',
                    lastName: 'marva'
                },
                address: {
                    streetAddress: 'marva',
                    city: 'marva',
                    state: 'marva'
                },
                phoneNumber: 'marva',
                mailAddress: 'marva',
                userCategory: 'manager',
                branchNumber: 'marva'
            };
        await sessionConnect.dropDatabase();
        await User.register(new User(user), "marva");
    } catch (err) { console.log("request error " + err) }*/


})()
.catch(err => {
    debug(`Failure: ${err}`);
    process.exit(0);
});

module.exports = app;

