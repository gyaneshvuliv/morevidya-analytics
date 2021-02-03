'use strict';

var express = require('express');
var controller = require('./flight.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');

// tracking
router.get('/tracking', auth.isAuthenticated(), controller.tracking)
router.get('/tracking/export/csv', auth.isAuthenticated(), controller.tracking_export_csv);
router.get('/tracking/bottom', auth.isAuthenticated(), controller.tracking_Bottom)

module.exports = router;
