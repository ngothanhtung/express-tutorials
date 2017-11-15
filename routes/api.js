var express = require('express');
var router = express.Router();
var db = require('../helpers/MongoDbHelper');
var authenticate = require('../helpers/AuthenticateHelper');

var validator = require('validator');

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
router.post('/authenticate', function (req, res) {
    // check login here   
    authenticate.login(req, res);
});

router.post('/product', function (req, res) {
    var data = req.body;
    var check = validator.isEmail('tungnt$softech.vn');
    console.log(check);
    res.send("OK");
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function (req, res, next) {
    authenticate.check(req, res, next);
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
router.get('/', function (req, res) {
    res.json({
        message: 'Welcome to the coolest API on earth!'
    });
});

router.get('/users', function (req, res) {
    db.findDocuments({}, "users", function (result) {
        res.json({
            success: true,
            message: "OK",
            token: "",
            data: result
        });
    })
});


router.get('/products', function (req, res) {
    db.findDocuments({}, "products", function (result) {
        res.json({
            success: true,
            message: "OK",
            token: "",
            data: result
        });
    })
});



router.get('/check', function (req, res) {
    res.json(req.decoded);
});

module.exports = router;