'use strict';

var express = require('express');
var controller = require('./cron.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');
var cronJob = require('cron').CronJob;


var gameEmailJob = new cronJob('00 10 06 * * *', function () {
    // var gameEmailJob = new cronJob('*/13 * * * * *', function () {
    controller.gameEmailCron()
});

var timeSpentJob = new cronJob('00 06 06 * * *', function () {
// var timeSpentJob = new cronJob('*/20 * * * * *', function () {
    controller.video_game_timespent_cron()
});

// runs every monday and friday
var countByHostJob = new cronJob('00 02 06 * * 1,5', function () {
    // var countByHostJob = new cronJob('*/10 * * * * *', function () {
    controller.countByHostCron()
});

var MTDJob = new cronJob('00 04 06 * * *', function () {
// var MTDJob = new cronJob('*/30 * * * * *', function () {
    controller.MTDCron()
});

var serverSessionnJob = new cronJob('00 05 06 * * *', function () {
//  var serverSessionnJob = new cronJob('*/45 * * * * *', function () {
    controller.serverSessionCron()
});


// gameEmailJob.start()
// timeSpentJob.start()
// countByHostJob.start()
// MTDJob.start()
// serverSessionnJob.start()

module.exports = router;
