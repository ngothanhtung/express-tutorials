var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var secrect = "123456789";

var db = require('../helpers/MongoDbHelper');

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
router.post('/authenticate', function (req, res) {
    // check login here

    var name = req.body.name;
    var password = req.body.password;
    var query = {
        name: name,
        password: password
    }

    db.findDocuments(query, 'users', function (result) {
        console.log(result);

        if (result.length > 0) {
            // create a token
            var payload = {
                name: name,
                password: password
            }
            var token = jwt.sign(payload, secrect, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.json({
                success: true,
                message: 'Token was created',
                token: token
            });
        } else {
            res.json({message: "Failed to authenticate token."});
        }
    });
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secrect, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
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