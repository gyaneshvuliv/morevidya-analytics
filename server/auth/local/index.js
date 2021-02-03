'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
  if (req.body.deviceId) {
    req.body.email = req.body.deviceId;
  }
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});
    if (user.role == 'admin') {
      var token = auth.signAdminToken(user.id, user.role);
    }else{
      var token = auth.signToken(user.id, user.role);
    }
    res.json({token: token});
  })(req, res, next)
});

module.exports = router;
