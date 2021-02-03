'use strict';

var express = require('express');
var controller = require('./map.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');
var config = require('../../config/environment');
//var redis = require('redis');
//var cache = require('apicache').options({debug:true,statusCodes: {exclude:[404,403,500,502,504],include:[]},redisClient: redis.createClient(config.redis) }).middleware;

//Vuscreen
router.get('/user/location/data', auth.isAuthenticated(),controller.get_lat_lng);
router.get('/buslist',auth.isAuthenticated(), controller.bus_list);

// play data geo wise
router.get('/play/geography/wise',auth.isAuthenticated(),controller.play_data_geography);

// play data geo wise
router.get('/ads/geography/wise',auth.isAuthenticated(),controller.ads_data_geography);

//Vuprime
router.get('/vp/user/location/data', auth.isAuthenticated(),controller.get_vp_lat_lng);

// play data geo wise
// router.get('/vp/play/geography/wise',auth.isAuthenticated(),controller.vp_play_data_geography);

// play data geo wise
// router.get('/vp/ads/geography/wise',auth.isAuthenticated(),controller.vp_ads_data_geography);

module.exports = router;
