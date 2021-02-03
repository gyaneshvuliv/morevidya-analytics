'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var db_vp = require('../../config/mysql_vp')
var moment = require('moment');

/*  Get list of lat long. 
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Date Format ---->  DD-MM-YYYY
    Author : Kedar Gadre
    Date : 16-08-2018
    Modified_by : Kedar Gadre
    Modification Date : 16-08-2018
*/

exports.get_lat_lng = function(req, res) {
  var intrfce='null',searchText='null';
  var filter = '';
  var bus = []
  if (req.query.bus == 'undefined' || req.query.bus == '') {
    var filter = '';
  }else{
    var a = req.query.bus
      var b = a.split(',')
      for (var i = 0; i < b.length; i++) {
        bus.push("'"+b[i]+"'")
      }
      filter = " AND vr.vehicle_no IN("+bus+")"
  }
  // if (req.query.version && req.query.version != "undefined") { version = "'"+req.query.version+"'";}
  if (req.query.interface && req.query.interface != "undefined") { intrfce = "'"+req.query.interface+"'";}
  if (req.query.searchText && req.query.searchText != "undefined") { searchText = "'"+req.query.searchText+"'";}
  var query ="select vt.reg_id,vt.interface,vt.view_model,"
            +" vt.view_android_id,"
            +" vt.latitude lat,"
            +" vt.longitude lng,"
            +" count(1) played,ROUND(SUM(view_duration/60000)) duration,"
            +" vr.vehicle_no,vr.source,vr.destination,vr.owner_name,am.login_id"
            +" from"
            +" vuscreen_tracker vt"
            +" JOIN vuscreen_registration vr ON vr.reg_id = vt.reg_id"
            +" JOIN account_management am ON am.id = vr.partner"
            +" where vt.partner= '"+ req.user.partner_id +"' AND vt.latitude > 0 " + filter +" group by vt.view_android_id";
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

/*  Get list of bus list. 
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Date Format ---->  DD-MM-YYYY
    Author : Kedar Gadre
    Date : 16-08-2018
    Modified_by : Kedar Gadre
    Modification Date : 16-08-2018
*/

exports.bus_list = function(req, res) {
  var query ="select distinct vehicle_no"
            +" from"
            +"  vuscreen_registration"
            +" where partner= '"+ req.user.partner_id +"'";
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

/*  Get list of play lat long. 
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Date Format ---->  DD-MM-YYYY
    Author : Kedar Gadre
    Date : 16-08-2018
    Modified_by : Kedar Gadre
    Modification Date : 16-08-2018
*/
exports.play_data_geography = function(req, res) {
  var currentDate = moment(new Date()).format('YYYY-MM-DD');

  var filter = " where sync_date = '"+currentDate+"' ",limit = 100000;
  if(req.query.id){
    filter = " where id > " + req.query.id + " ";
    limit = 100;
  }
  var query = "select CONCAT('play-', B.id) as uniqueId,B.id,B.view_id,B.view_android_id,B.view_datetime,B.latitude lat,"
              +" B.longitude lng,B.interface,B.view_model,ROUND(B.view_duration/60000,2) view_duration,A.thumbnail,A.genre,A.title from (select id,view_id,"
              +" latitude,longitude,partner,view_model,view_duration,view_datetime,sync_datetime,view_android_id,interface from vuscreen_tracker "+filter+" ) B "
              +" JOIN vuscreen_content_package A ON A.content_id = B.view_id "
              +" where B.partner= '"+ req.user.partner_id +"'"
              +" AND B.latitude > 0 AND B.view_datetime != '' AND A.type = 'video' limit "+limit.toString();
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

/*  Get list of ads lat long. 
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Date Format ---->  DD-MM-YYYY
    Author : Kedar Gadre
    Date : 16-08-2018
    Modified_by : Kedar Gadre
    Modification Date : 16-08-2018
*/
exports.ads_data_geography = function(req, res) {
  var currentDate = moment(new Date()).format('YYYY-MM-DD');

  var filter = " where sync_date = '"+currentDate+"' ",limit = 100000;
  if(req.query.id){
    filter = " where id > " + req.query.id + " ";
    limit = 100;
  }
  var query = "select CONCAT('play-', B.id) as uniqueId,B.id,B.view_id,B.view_android_id,B.view_datetime,B.latitude lat,"
              +" B.longitude lng,B.interface,B.view_model,ROUND(B.view_duration/1000,2) view_duration,A.thumbnail,A.genre,A.title from (select id,view_id,"
              +" latitude,longitude,partner,view_model,view_duration,view_datetime,sync_datetime,view_android_id,interface from vuscreen_tracker "+filter+" ) B "
              +" JOIN vuscreen_content_package A ON A.content_id = B.view_id "
              +" where B.partner= '"+ req.user.partner_id +"'"
              +" AND B.latitude > 0 AND B.view_datetime != '' AND A.type = 'ad' limit "+limit.toString();
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};



/*  Get list of ads lat long. 
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Date Format ---->  DD-MM-YYYY
    Author : Kedar Gadre
    Date : 14-09-2018
*/
exports.get_vp_lat_lng = function(req, res) {
  var intrfce='null',searchText='null';
  var filter = '';
  var version = []
  if (req.query.version != 'undefined') {
      var a = req.query.version
      var b = a.split(',')
      for (var i = 0; i < b.length; i++) {
        version.push("'"+b[i]+"'")
      }
      filter = " AND version IN("+version+")"
  }
  // if (req.query.version && req.query.version != "undefined") { version = "'"+req.query.version+"'";}
  if (req.query.interface && req.query.interface != "undefined") { intrfce = "'"+req.query.interface+"'";}
  if (req.query.searchText && req.query.searchText != "undefined") { searchText = "'"+req.query.searchText+"'";}
  var query ="select android_id,"
            +"  name,age,gender,phone_no,_interface,model,"
            +"  latitude,"
            +"  longitude"
            +" from"
            +"  vupoint_registration "
            +" where latitude > 0 " + filter + " AND (android_id=IFNULL("+searchText+", android_id) OR name=IFNULL("+searchText+", name)"
            +" OR phone_no=IFNULL("+searchText+", phone_no))" ;
  console.log(query)
            db_vp.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}
