var express = require('express');
var router = express.Router();
    
var authenticate = require('../helpers/AuthenticateHelper');

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
router.post('/authenticate', function (req, res) {
    // check login here   
    authenticate.login(req, res);
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
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

router.get('/users', function (req, res) {
    db.findDocuments({}, "users", function(result) {
        res.json(result);
    })  
});

router.get('/check', function (req, res) {
    res.json(req.decoded);
});

module.exports = router;