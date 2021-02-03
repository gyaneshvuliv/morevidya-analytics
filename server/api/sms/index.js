'use strict';

var express = require('express');
var controller = require('./sms.controller');
var router = express.Router();
var cronJob = require('./sms.cron');
var agenda = require('../../config/agenda').get();


// agenda.define('sms_video_view_daily', {priority: 'high', concurrency: 1}, function(job, done) {
//   cronJob.send_sms_video_view_daily(done);
// });
// agenda.on('ready', function() {
//   // agenda.every('00 05 00 * * *', 'sms_video_view_daily', {});
//   agenda.every('48 */1 * * *', 'sms_video_view_daily', {});
//   agenda.start();
// });


// agenda.define('sms_video_view_hourly', {priority: 'high', concurrency: 1}, function(job, done) {
//   cronJob.send_sms_video_view_hourly(done);
// });
// agenda.on('ready', function() {
//   agenda.every('06 */1 * * *', 'sms_video_view_hourly', {});
//   // agenda.every('*/2 * * * *', 'sms_video_view_hourly', {});
//   agenda.start();
// });

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
// router.get('/sms/test', controller.test_last_Five_Week_Avg_Vs_with_Current_Week_Avg_Date);

module.exports = router;
