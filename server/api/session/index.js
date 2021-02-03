'use strict';

var express = require('express');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');


var router = express.Router();

router.get('/check', auth.isAuthenticated(), function(req,res) {
    var redirectUrl = '/app/dashboard'
    if (req.query.redirectUrl && req.query.redirectUrl != '/') { redirectUrl = req.query.redirectUrl};
    res.status(200).json({name:req.user.name,email:req.user.email,redirectUrl:redirectUrl});
});
module.exports = router;
