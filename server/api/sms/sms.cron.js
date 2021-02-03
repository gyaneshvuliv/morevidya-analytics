'use strict';

var request = require('request');
var _ = require('lodash');
var moment = require('moment');
var sms = require('./sms.controller');

exports.send_sms_video_view_daily = function (cb) {
  var firstLastDate = new Date();
  firstLastDate.setDate(firstLastDate.getDate()-1);
  var firstLastDate = moment(firstLastDate).format('YYYY-MM-DD').toString();
  var secondLastDate = new Date();
  secondLastDate.setDate(secondLastDate.getDate()-2);
  var secondLastDate = moment(secondLastDate).format('YYYY-MM-DD').toString();
  sms.send_sms_video_view_daily({firstLastDate:firstLastDate,secondLastDate:secondLastDate},function(err,doc){
    cb(err,doc)
  });
};

exports.send_sms_video_view_hourly = function (cb) {
  var currentDate = new Date();
  var currentDate = moment(currentDate).format('YYYY-MM-DD').toString();
  var firstLastDate = new Date();
  firstLastDate.setDate(firstLastDate.getDate()-1);
  var firstLastDate = moment(firstLastDate).format('YYYY-MM-DD').toString();
  debugger;
  var hour = parseInt(moment(new Date()).format('H')) - 1;
  if (hour<0) {
    hour = '23';
    
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-1);
    var currentDate = moment(currentDate).format('YYYY-MM-DD').toString();

    var firstLastDate = new Date();
    firstLastDate.setDate(firstLastDate.getDate()-2);
    var firstLastDate = moment(firstLastDate).format('YYYY-MM-DD').toString();

  }else{
    if (hour.toString().length == 1) {
      hour = '0'+hour.toString();
    }else{
      hour = hour.toString();
    }
  }
  sms.send_sms_video_view_hourly({currentDate:currentDate,firstLastDate:firstLastDate,hour:hour},function(err,doc){
    cb(err,doc)
  });
};