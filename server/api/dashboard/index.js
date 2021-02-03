'use strict';

var express = require('express');
var controller = require('./dashboard.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');
var config = require('../../config/environment');
//var redis = require('redis');
//var cache = require('apicache').options({debug:true,statusCodes: {exclude:[404,403,500,502,504],include:[]},redisClient: redis.createClient(config.redis) }).middleware;

router.get('/server-static-count',auth.isAuthenticated(), controller.get_server_static_count);
router.get('/played-static-count',auth.isAuthenticated(), controller.get_played_static_count);
router.get('/duration-static-count',auth.isAuthenticated(), controller.get_duration_static_count);
router.get('/currmonth-static-count',auth.isAuthenticated(), controller.get_currmonth_static_count);
router.get('/premonth-static-count',auth.isAuthenticated(), controller.get_premonth_static_count);
router.get('/file-per-user-count',auth.isAuthenticated(), controller.get_fileplayed_peruser_count);
router.get('/click-per-user-count',auth.isAuthenticated(), controller.get_totaClick_peruser_count);
router.get('/fnb-per-user-count',auth.isAuthenticated(), controller.get_fnbClick_peruser_count);
router.get('/audio-per-user-count',auth.isAuthenticated(), controller.get_audioClick_peruser_count);
router.get('/magzine-per-user-count',auth.isAuthenticated(), controller.get_magzineClick_peruser_count);
router.get('/game-per-user-count',auth.isAuthenticated(), controller.get_gameplayed_peruser_count);
router.get('/gametime-per-user-count',auth.isAuthenticated(), controller.get_gametime_peruser_count);
router.get('/gameplay-overlap-user-count',auth.isAuthenticated(), controller.get_gameplay_overlap_count);
router.get('/watch-login-count',auth.isAuthenticated(), controller.get_watch_login_count);
router.get('/vp-server-static-count',auth.isAuthenticated(), controller.get_vp_server_static_count);
router.get('/vp-played-static-count',auth.isAuthenticated(), controller.get_vp_played_static_count);
router.get('/vp-duration-static-count',auth.isAuthenticated(), controller.get_vp_duration_static_count);
router.get('/vp-currmonth-static-count',auth.isAuthenticated(), controller.get_vp_currmonth_static_count);
router.get('/vp-premonth-static-count',auth.isAuthenticated(), controller.get_vp_premonth_static_count);
router.get('/wifi-login-count',auth.isAuthenticated(), controller.get_wifi_login_count);
router.get('/platform-durationss',auth.isAuthenticated(), controller.get_Platform_durations);
// router.get('/platform-duration-yday',auth.isAuthenticated(), controller.get_Platform_duration_ysday);
 
module.exports = router;
