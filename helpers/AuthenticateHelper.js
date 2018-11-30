var express = require('express');
var AuthenticateHelper = express.Router();

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var secrect = "123456789";

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
AuthenticateHelper.check = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secrect, function (err, decoded) {
            if (err) {
                return res.json({ ok: false, message: 'Failed to authenticate token.' });
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
            ok: false,
            message: 'No token provided.',
        });
    }
};


AuthenticateHelper.login = function (req, res) {
    var data = req.body;
    var username = data.username;
    var password = data.password;
    var query = {
        username: username,
        password: password
    }

    //console.log(query);
    if (username === 'admin' && password === '123456789') {
        // create a token
        var payload = {
            username: username,
            password: password
        }
        var token = jwt.sign(payload, secrect, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.json({
            ok: true,
            message: 'Token was created',
            token: token,
        });
    } else {
        res.json(
            {
                ok: false,
                message: "Failed to authenticate token.",
            }
        );
    }
}
module.exports = AuthenticateHelper;
