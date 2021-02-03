'use strict';

var _ = require('lodash');
var db_vp = require('../../config/mysql_vp')
var moment = require('moment');
// var EM = require('../../../server/config/email-dispatcher');
var NodeCache = require( "node-cache" );
// var cachedData = new NodeCache({ stdTTL: 0 });
// var mongoose = require('mongoose')
// var json2csv = require('json2csv');
// var fs = require('fs')
// var config = require('../../../server/config/environment');
// var request = require('request');


/*  
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date Formate  : DD/MM/YYYY
    Date : 13/09/2018
    Modified_by : Kedar Gadre
    Modification Date : 13/09/2018
*/
exports.get_fileplayshare_hourwise = function(req, res) {
  var days = [35,28,21,14,7]
  var beforeOneWeek;
  var day;
  var diffToMonday;
  var dayofweeks = [];
  var filter;  
  var version;
  if(req.query.version != "undefined" && req.query.version != ""){ 
     version = "'"+req.query.version+"'"
  }else{
    version = 'null'
  } 
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}
  filter = " sync_date >= '"+startDate+"' AND sync_date <= '"+endDate + "' AND version = IFNULL("+version+",version) "
  if(req.query.daysfilter != "undefined" && req.query.daysfilter != ""){
      for (var i = 0; i < days.length; i++) {
        beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * days[i] * 1000)
        day = beforeOneWeek.getDay()
        diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
        dayofweeks.push(moment(new Date(beforeOneWeek.setDate(diffToMonday+parseInt(req.query.daysfilter)))).format('YYYY-MM-DD'))
      };
      if(req.query.daysfilter == new Date().getDay()-1){
        dayofweeks.push(moment(new Date()).format('YYYY-MM-DD'))
      }

      filter = " version = IFNULL("+version+",version) AND "
            +"  sync_date IN " +JSON.stringify(dayofweeks).replace('[','(').replace(']',')')
  }


  var query = "SELECT DATE_FORMAT(sync_datetime, '%Y-%m-%d') date,"
              +"      DATE_FORMAT(sync_datetime,'%H') hourRange,"
              +"      count(1) server"
              +" FROM vupoint_file "
              +" where " + filter + " AND duration>0 AND partner= '"+ req.user.partner_id +"'" 
              +" GROUP BY hourRange,date order by date , hourRange";
    console.log(query)
              db_vp.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    else{
        var query1 = "SELECT DATE_FORMAT(sync_datetime, '%Y-%m-%d') date,"
              +"      DATE_FORMAT(sync_datetime,'%H') hourRange,"
              +"      ROUND(SUM(duration/60000)) client"
              +" FROM vupoint_file "
              +" where " + filter + " AND duration>0 AND partner = '"+ req.user.partner_id +"'"
              +" GROUP BY hourRange,date order by date , hourRange";
        db_vp.get().query(query1, function (err,doc1) {
        if(err) { return handleError(res, err); }
        var data = [doc,doc1]    
        return res.status(200).json(data);
        })
    }
  })
};


/*  
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date Formate  : DD/MM/YYYY
    Date : 13/09/2018
    Modified_by : Kedar Gadre
    Modification Date : 13/09/2018
*/
// #Get list of registered logs
var vuprime_getAllRegData_Pagination = function(req, cb) {
  var startDate='null',endDate='null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}
  var filter = '';

  if (req.query.android_id) {filter = " AND android_id ='"+req.query.android_id+"'" }
  if (req.query.name) {filter = " AND name ='"+req.query.name+"'" }
  if (req.query.interface) {filter = " AND _interface ='"+req.query.interface+"'"}
  if (req.query.email) {filter = " AND email ='"+req.query.email+"'"}
  if (req.query.partner) {filter = " AND partner ='"+req.query.partner+"'"}
  if (req.query.reg_id) {filter = " AND reg_id ='"+req.query.reg_id+"'"}
  if (req.query.phone_no) {filter = " AND phone_no ='"+req.query.phone_no+"'"}  
  
  var query = "select * from vupoint_registration"
      +" where partner = '"+ req.user.partner_id +"' AND sync_date >= '"+startDate+"' AND sync_date <= '"+endDate +"'"+filter
      +" order by sync_datetime desc"
  var option = {draw:req.query.draw,start:req.query.start,length:req.query.length};
  // console.log(query)
  db_vp.pagination(query,option, function (err,doc) {
    return cb(err,doc);
  })
};

// #Get list of registered users
exports.vuprime_registration_index = function(req, res) {
  vuprime_getAllRegData_Pagination(req,function(err,doc){
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


//#export csv function for registered user
exports.vuprime_registration_export_csv = function (req, res) {
  var fields = ["reg_id","partner","android_id","name","age","gender","phone_no","email_id","model","_interface","sync_datetime","latitude","longitude"];
  var fieldversions = ["reg_id","partner","android_id","name","age","gender","phone_no","email_id","model","_interface","sync_datetime","latitude","longitude"];

  var name = 'registered_'+ (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fields.join(","));
  
  function pagination(){
    vuprime_getAllRegData_Pagination(req,function(err,doc){
      if (doc.data.length>0) {
        req.query.start = parseInt(req.query.start) + parseInt(req.query.length);
        var row = '';
        for (var i = 0; i < doc.data.length; i++) {
          var json = doc.data[i];
          var col = ''; 
          for (var x = 0; x < fields.length; x++) {
            var val = json[fields[x]];
            if(val){
              val = val.toString().replace(/,/g,' ').replace(/"/g,' ');
            }
            if (val == '' || typeof(val) == 'undefined' || val==null ) {val = ' ';};
            if (fields[x] == 'sync_datetime') { val =  moment(val).format('YYYY-MM-DD HH:mm:ss ').toString() };
              if (col == '' ) {
                col = val;
              }else{
                col = col + ',' + val;
              }
            };
          if (row == '') {row = col;}
          else{row = row + '\r\n' + col;}
        };
        res.write('\r\n');
        res.write(row);
        pagination();
      }else{
        res.end();
      }
    })
  }
  pagination();
}


// Get list of activity tracker logs
var vuprime_getAlTrackerData_Pagination = function(req, cb) {
  var startDate='null',endDate='null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}
  var filter = '';
  if (req.query.android_id) {filter = " AND android_id ='"+req.query.android_id+"'" }
  if (req.query.reg_id) {filter = " AND reg_id ='"+req.query.reg_id+"'" }
  if (req.query.partner) {filter = " AND partner ='"+req.query.partner+"'"}
  if (req.query.type) {filter = " AND type ='"+req.query.type+"'"}
  // if (req.query.tracking_type) {filter = " AND tracking_type ='"+req.query.tracking_type+"'"}
  // if (req.query._interface) {filter = " AND _interface ='"+req.query._interface+"'"}

  var query = "select * "
          +" from "
          +" vupoint_file"
          +" where sync_date>='" +startDate+ "' AND sync_date<='"+endDate+"' AND partner = '"+ req.user.partner_id +"'" + filter
          +" order by sync_datetime desc"
  var option = {draw:req.query.draw,start:req.query.start,length:req.query.length};
  db_vp.pagination(query,option, function (err,doc) {
    return cb(err,doc);
  })
};

// Get list of activity tracker logs
exports.vuprime_tracker_index = function(req, res) {
  vuprime_getAlTrackerData_Pagination(req,function(err,doc){
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


//export csv function for  activity tracker logs
exports.vuprime_tracker_export_csv = function (req, res) {
  var fields = ["reg_id","partner","android_id","name","duration","type","tracking_type","_interface","model","view_datetime"];
  var fieldversions = ["reg_id","partner","android_id","name","duration","type","tracking_type","_interface","model","view_datetime"];

  var name = 'tracker'+ (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fieldversions.join(","));
  
  function pagination(){
    vuprime_getAlTrackerData_Pagination(req,function(err,doc){
      if (doc.data.length>0) {
        req.query.start = parseInt(req.query.start) + parseInt(req.query.length);
        var row = '';
        for (var i = 0; i < doc.data.length; i++) {
          var json = doc.data[i];
          var col = ''; 
          for (var x = 0; x < fields.length; x++) {
            var val = json[fields[x]];
            if(val){
              val = val.toString().replace(/,/g,' ').replace(/"/g,' ');
            }
            if (val == '' || typeof(val) == 'undefined' || val==null ) {val = ' ';};
            if (fields[x] == 'view_datetime') { val =  moment(val).format('YYYY-MM-DD HH:mm:ss ').toString() };
            if (fields[x] == 'sync_datetime') { val =  moment(val).format('YYYY-MM-DD HH:mm:ss ').toString() };
              if (col == '' ) {
                col = val;
              }else{
                col = col + ',' + val;
              }
            };
          if (row == '') {row = col;}
          else{row = row + '\r\n' + col;}
        };
        res.write('\r\n');
        res.write(row);
        pagination();
      }else{
        res.end();
      }
    })
  }
  pagination();
}

exports.top_10_content = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}
  var query = '';
  if(req.query.vehicle_no == "undefined" || req.query.vehicle_no == ""){
    query = "select "
              +" vc.title,"
              +" vc.genre,"
              +" count(1) count,"
              +" count(distinct vst.mac) uniqueviwers,"
              +" ROUND(sum(vst.view_duration/60000),2) duration"
              +" from"
              +" vuscreen_tracker vst"
              +" LEFT JOIN"
              +" vuscreen_content_package vc ON vst.view_id = vc.content_id"
              +" LEFT JOIN"
              +" vuscreen_registration vr ON vst.reg_id = vr.reg_id"
              +" where vst.partner = '"+req.user.partner_id+"'"
              +" AND vst.sync_date>='"+ startDate +"'AND vst.sync_date<='"+endDate+"'"
              // +" AND vehicle_no IN ('DL1VC2892','DL1VC2871' , 'DL1VC2900',"
              // +" 'DL1VC2861',"
              // +" 'DL1VC2888',"
              // +" 'DL1VC2893',"
              // +" 'DL1VC2942',"
              // +" 'DL1VC2887',"
              // +" 'DL1VC2738')"
              +" group by vc.title"
              +" order by count desc "
              // +" limit 15";
  }else{
    query = "select "
              +" vc.title,"
              +" vc.genre,"
              +" count(1) count,"
              +" count(distinct vst.mac) uniqueviwers,"
              +" ROUND(sum(vst.view_duration/60000),2) duration"
              +" from"
              +" vuscreen_tracker vst"
              +" LEFT JOIN"
              +" vuscreen_content_package vc ON vst.view_id = vc.content_id"
              +" LEFT JOIN"
              +" vuscreen_registration vr ON vst.reg_id = vr.reg_id"
              +" where vst.partner = '"+req.user.partner_id+"' AND vr.vehicle_no = '"+req.query.vehicle_no+"'"
              +" AND vst.sync_date>='"+ startDate +"'AND vst.sync_date<='"+endDate+"'"
              +" group by vc.title"
              +" order by count desc "
              //limit 15";
  }
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


exports.top_10_genre = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}
  var query = "select "
              +" vc.genre,"
              +" count(1) count,"
              +" count(distinct vst.mac) uniqueviwers"
              +" from"
              +" vuscreen_tracker vst"
              +" JOIN"
              +" vuscreen_content_package vc ON vst.view_id = vc.content_id"
              +" where vst.partner = '"+req.user.partner_id+"' AND"
              +" vst.sync_date>='"+ startDate +"'AND vst.sync_date<='"+endDate+"'"
              +" group by vc.genre"
              +" order by count desc limit 15";
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


/*  Get list of top buses by time spent.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 29/01/2018
    Modified_by : Kedar Gadre
    Modification Date : 29/01/2018
*/
exports.busSummary = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}

  var query = "select "
                  +" B.vehicle_no bus,ROUND(sum(A.view_duration/60000),2) count,count(1) views, count(distinct A.mac) uniqueviwers"
              +" from"
                  +" vuscreen_tracker A Left Join vuscreen_registration B ON A.reg_id = B.reg_id"
                  +" where "
                  +" A.sync_date>='"+ startDate +"' AND A.sync_date<='"+endDate+"' AND B.vehicle_no != ''"
                  +" AND A.partner = '"+req.user.partner_id+"' group by B.vehicle_no order by count desc"
                  // console.log(query)
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

/*  Get list of top content played on bus.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 29/01/2018
    Modified_by : Kedar Gadre
    Modification Date : 29/01/2018
*/
exports.busSummaryDetails = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}

  var query = "select "
              +" B.title,"
              +" ROUND(sum(A.view_duration/60000),2) count,"
              +" count(1) views,"
              +" count(distinct A.mac) uniqueviwers"
          +" from"
              +" vuscreen_tracker A"
                  +" Left Join"
              +" vuscreen_content_package B ON A.view_id = B.content_id"
            +" Join vuscreen_registration C ON A.reg_id = C.reg_id"
          +" where"
              +" A.sync_date >= '"+ startDate +"'"
                  +" AND A.sync_date <= '"+ endDate +"'"
          +" AND A.partner = '"+req.user.partner_id+"'"
          +" AND C.vehicle_no = '"+req.params.cat+"'"
          +" group by B.title"
          +" order by count desc limit 15"  
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


/*  Get list of top genre by time spent.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 29/01/2018
    Modified_by : Kedar Gadre
    Modification Date : 29/01/2018
*/
exports.genreSummary = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}

  var query = "select "
                  +" B.genre,ROUND(sum(A.view_duration/60000),2) count,count(1) views, count(distinct A.mac) uniqueviwers"
              +" from"
                  +" vuscreen_tracker A Left Join vuscreen_content_package B ON A.view_id = B.content_id"
                  +" where "
                  +" A.sync_date>='"+ startDate +"' AND A.sync_date<='"+endDate+"' AND B.genre != ''"
                  +" AND A.partner = '"+req.user.partner_id+"' group by B.genre order by count desc"
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

/*  Get list of top content played on genre.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 29/01/2018
    Modified_by : Kedar Gadre
    Modification Date : 29/01/2018
*/
exports.genreSummaryDetails = function(req, res) {
  var startDate,endDate;
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD');}
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD');}

  var query = "select "
              +" B.title,"
              +" ROUND(sum(A.view_duration/60000),2) count,"
              +" count(1) views,"
              +" count(distinct A.mac) uniqueviwers"
          +" from"
              +" vuscreen_tracker A"
                  +" Left Join"
              +" vuscreen_content_package B ON A.view_id = B.content_id"
          +" where"
              +" A.sync_date >= '"+ startDate +"'"
                  +" AND A.sync_date <= '"+ endDate +"'"
          +" AND A.partner = '"+req.user.partner_id+"'"
          +" AND B.genre = '"+req.params.cat+"'"
          +" group by B.title"
          +" order by count desc limit 15"  
  db.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


// get user lat long by id 
exports.get_userpath = function(req,res){
  var query = "select vpt.latitude,vpt.longitude,vpt.sync_datetime,"
              +" vpr.android_id,vpr.name,vpr.age,vpr.phone_no,vpr.gender,vpr._interface,vpr.model"
              +" from"
                  +" vupoint_location_tracker vpt JOIN vupoint_registration vpr"
                  +" on vpt.android_id = vpr.android_id"
                  +" where "
                  +" vpt.android_id='"+ req.params.id +"' and vpt.latitude>0"
  db_vp.get().query(query, function (err,doc) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
}





function handleError(res, err) {
  return res.status(500).send(err);
}