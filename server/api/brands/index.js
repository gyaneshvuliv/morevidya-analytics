'use strict';

var express = require('express');
var controller = require('./brand.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');


//ads
router.get('/ads', auth.isAuthenticated(), controller.vuscreen_ads_index);
// change ad status
router.post('/change-ads-status', auth.isAuthenticated(), controller.change_ads_status)

module.exports = router;
