'use strict';

var express = require('express');
var controller = require('./vuprime.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');
var config = require('../../config/environment');
//var redis = require('redis');
//var cache = require('apicache').options({debug:true,statusCodes: {exclude:[404,403,500,502,504],include:[]},redisClient: redis.createClient(config.redis) }).middleware;
var cronJob = require('cron').CronJob;


// router.get('/serverclient/datewise',auth.isAuthenticated(), controller.get_serverclient_datewise);
// router.get('/serverclient/hourwise',auth.isAuthenticated(), controller.get_serverclient_hourwise);
router.get('/fileplayshare/hourwise',auth.isAuthenticated(), controller.get_fileplayshare_hourwise);
// router.get('/action/summary',auth.isAuthenticated(), controller.get_action_summary);
// router.get('/server',auth.isAuthenticated(), controller.vuprime_index);
// router.get('/server/export/csv',auth.isAuthenticated(), controller.vuprime_export_csv);

//pie graphs
// router.get('/busSummary',auth.isAuthenticated(), controller.busSummary);
// router.get('/busSummary/:cat',auth.isAuthenticated(), controller.busSummaryDetails);
// router.get('/genreSummary',auth.isAuthenticated(), controller.genreSummary);
// router.get('/genreSummary/:cat',auth.isAuthenticated(), controller.genreSummaryDetails);

//registration
router.get('/registration',auth.isAuthenticated(), controller.vuprime_registration_index);
router.get('/registration/export/csv',auth.isAuthenticated(), controller.vuprime_registration_export_csv);

//events
// router.get('/events',auth.isAuthenticated(), controller.vuprime_events_index);
// router.get('/events/export/csv',auth.isAuthenticated(), controller.vuprime_events_export_csv);


//activity tracker
router.get('/tracker',auth.isAuthenticated(), controller.vuprime_tracker_index);
router.get('/tracker/export/csv',auth.isAuthenticated(), controller.vuprime_tracker_export_csv);



// top 10 content played
// router.get('/topcontent',auth.isAuthenticated(), controller.top_10_content);

// top 10 Genre played
// router.get('/topgenre',auth.isAuthenticated(), controller.top_10_genre);

// get user lat long by id
router.get('/userpath/:id',auth.isAuthenticated(), controller.get_userpath)

// edit registration details
// router.post('/edit-registration',auth.isAuthenticated(), controller.edit_registration)

// send sms
// router.get('/send-sms',auth.isAuthenticated(), controller.send_sms)


var morjob = new cronJob('00 05 12 * * *', function(){
// var morjob = new cronJob('*/10 * * * * *', function(){
    // cron.play_views_hourwise_cron();
    controller.server_session_mor_cron()

});

var evejob = new cronJob('00 05 23 * * *', function(){
// var evejob = new cronJob('*/15 * * * * *', function(){
    // cron.play_views_hourwise_cron();
    controller.server_session_eve_cron()

});

var zimindarajob = new cronJob('00 00 8,13,18,22 * * *', function(){
// var zimindarajob = new cronJob('*/15 * * * * *', function(){
    controller.zimindara_cron()
});

var indocanadianjob = new cronJob('00 00 8,13,18,22 * * *', function(){
// var indocanadianjob = new cronJob('*/15 * * * * *', function(){
    controller.indocanadian_cron()
});

var buswisecsvjob = new cronJob('00 45 11 * * *', function(){
// var buswisecsvjob = new cronJob('*/15 * * * * *', function(){
    controller.buswisecsv_cron()
});
    

// morjob.start()
// evejob.start()
// zimindarajob.start()
// indocanadianjob.start()
// buswisecsvjob.start()

module.exports = router;
