'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var moment = require('moment');
var EM = require('../../../server/config/email-dispatcher');
var NodeCache = require("node-cache");
var cachedData = new NodeCache({ stdTTL: 0 });
var json2csv = require('json2csv');
var zlib = require('zlib');
var fs = require('fs')
var config = require('../../../server/config/environment');
const AWS = require('aws-sdk');
const s3_details = {
  "accessKeyId": "AKIAQROCQCOGH7Y3RUEG",
  "secretAccessKey": "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",
  "region": "ap-southeast-1",
  "bucket": "mobisign-bucket/Automated_Reports",
}

const s3Client = new AWS.S3({
  accessKeyId: s3_details.accessKeyId,
  secretAccessKey: s3_details.secretAccessKey,
});


/*  Get Daily Email with last seven days game payed.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 16/09/2020
*/
exports.gameEmailCron = function () {
  let d = new Date();
  let d1 = d.setDate(d.getDate() - 1);
  let d2 = d.setDate(d.getDate() - 6);
  d1 = moment(d1).format('YYYY-MM-DD').toString();
  d2 = moment(d2).format('YYYY-MM-DD').toString();
  let query = "SELECT vc.title as vehicle_no, vst.sync_date, COUNT(1) COUNT"
    + " FROM vuscreen_tracker vst"
    + " LEFT JOIN vuscreen_registration vr ON vst.reg_id = vr.reg_id"
    + " LEFT JOIN vuscreen_store_content vc ON vst.view_id = vc.content_id"
    + " WHERE vst.sync_date>='" + d2 + "' AND vst.sync_date<='" + d1 + "' AND vr.vehicle_no NOT REGEXP '[A-Z ]' AND vst.type='zip'"
    + " GROUP BY vc.title, vst.sync_date"
    + " ORDER BY vst.sync_date, vc.title"
  db.get().query(query, function (err, dataArray) {
    if (err) {
      console.log(err)
    } else {
      let userMap = new Map();
      function formatDate(date) {
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        date = yyyy + '-' + mm + '-' + dd;
        return date
      }
      let Last7Days = [];
      let obj = {}
      for (let i = 0; i < 7; i++) {
        let d = new Date();
        d.setDate(d.getDate() - i - 1);
        Last7Days.push(formatDate(d))
        let da = formatDate(d)
        obj[da] = 0;
        obj["rowSum"] = 0;
      }

      Last7Days.reverse().join(',');
      let finalArr = []
      for (let i = 0; i < dataArray.length; i++) {
        const element = dataArray[i];
        if (!userMap.has(element.vehicle_no)) {
          let arr = []
          arr.push(element)
          let kg = Object.assign({ vehicle_no: element.vehicle_no }, obj)
          finalArr.push(kg)
          userMap.set(element.vehicle_no, arr)
          // if (i == 0) {
          //     let kg = Object.assign({ vehicle_no: "total" }, obj)
          //     finalArr.push(kg)
          // }

        } else {
          let arr = userMap.get(element.vehicle_no)
          arr.push(element)
          userMap.set(element.vehicle_no, arr)
        }
        if (dataArray.length == i + 1) {
          userMap.forEach((value, key, map, index) => {
            for (let d = 0; d < finalArr.length; d++) {
              const data = finalArr[d];
              let count = 0;
              for (let val = 0; val < value.length; val++) {
                const obj = value[val];
                if (obj["vehicle_no"] == data.vehicle_no) {
                  count = count + parseInt(obj.COUNT)
                  data[obj.sync_date] = obj.COUNT
                  data["rowSum"] = count;
                }
              }
            }
          });
        }
      }
      finalArr.sort((a, b) => b.rowSum - a.rowSum)
      var html = "<html><head>"
      html += "<style>"
      html += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
      html += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}"
      html += "tr:nth-child(even) {background-color: #dddddd;}</style></head>"
      html += "<h4>Dear Recipients,</h4>"
      html += "<h4>Please find below table for game played.</h4><table>"
      html += "<thead><tr>"
      html += "<th>Title</th><th>" + Last7Days[0] + "</th><th>" + Last7Days[1] + "</th>"
      html += "<th>" + Last7Days[2] + "</th><th>" + Last7Days[3] + "</th>"
      html += "<th>" + Last7Days[4] + "</th><th>" + Last7Days[5] + "</th><th>" + Last7Days[6] + "</th><th>Total</th>"
      html += "</tr></thead><tbody>"
      let col0 = 0;
      let col1 = 0;
      let col2 = 0;
      let col3 = 0;
      let col4 = 0;
      let col5 = 0;
      let col6 = 0;
      let finalSum = 0;
      for (let index = 0; index < finalArr.length; index++) {
        const element = finalArr[index];
        col0 = col0 + element[Last7Days[0]];
        col1 = col1 + element[Last7Days[1]];
        col2 = col2 + element[Last7Days[2]];
        col3 = col3 + element[Last7Days[3]];
        col4 = col4 + element[Last7Days[4]];
        col5 = col5 + element[Last7Days[5]];
        col6 = col6 + element[Last7Days[6]];
        html += "<tr>"
        html += "<td><b>" + element.vehicle_no + "</b></td>"
        html += "<td>" + element[Last7Days[0]] + "</td>"
        html += "<td>" + element[Last7Days[1]] + "</td>"
        html += "<td>" + element[Last7Days[2]] + "</td>"
        html += "<td>" + element[Last7Days[3]] + "</td>"
        html += "<td>" + element[Last7Days[4]] + "</td>"
        html += "<td>" + element[Last7Days[5]] + "</td>"
        html += "<td>" + element[Last7Days[6]] + "</td>"
        html += "<td><b>" + element.rowSum + "</b></td>"
        html += "</tr>"
      }
      finalSum = col0 + col1 + col2 + col3 + col4 + col5 + col6;
      html += "<tr><td><b>Total</b></td><td><b>" + col0 + "</b></td><td><b>" + col1 + "</b></td><td><b>" + col2 + "</b></td>"
      html += "<td><b>" + col3 + "</b></td><td><b>" + col4 + "</b></td>"
      html += "<td><b>" + col5 + "</b></td><td><b>" + col6 + "</b></td><td><b>" + finalSum + "</b></td></tr>";
      html += "</tbody></table>";
      html += "<br><br><h5>Thanks & Regards</h5><h5>Mobi Sign Pvt Ltd.</h5></html>"
      let subject = "Games Content Ranking Report"
      let email = 'manoj.gupta@mobisign.co.in ,deepak.kumar@mobisign.co.in,product@mobisign.co.in,monali.monalisa@mobisign.co.in,ashyin.thakral@mobisign.co.in,kedargdr@gmail.com'
      // let email = 'kedargdr@gmail.com,deepak.kumar@mobisign.co.in'
      EM.dispatchEmail(email, subject, html, "play", function (e) {
        console.log(e)
      })
    }
  })
}

/*  Get Cron For Video & Games time spent csv.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 16/09/2020
*/
exports.video_game_timespent_cron = function () {
  let d = new Date();
  d.setDate(d.getDate() - 1);
  let Yesterday = moment(d).format('YYYY-MM-DD').toString();
  let query = "select "
    + " vc.title,"
    + " vc.thumbnail,"
    + " vst.type,"
    + " vc.genre,"
    + " vf.folder,"
    + " am.login_id,"
    + " vst.session_id,"
    + " vst.view_android_id,"
    + " vst.device_id,"
    + " vst.version,"
    + " vst.interface,"
    + " vst.model,"
    + " vst.mac,"
    + " vst.reg_id,"
    + " vst.sync_date,"
    + " vst.view_model,"
    + " vst.view_duration view_duration,"
    + " vst.view_datetime,"
    + " vr.source,"
    + " vr.destination,"
    + " vr.vehicle_no,"
    + " vst.sync_datetime,"
    + " vst.user_agent"
    + " from"
    + " vuscreen_tracker vst"
    + " LEFT JOIN"
    + " vuscreen_content_package vc ON vst.view_id = vc.content_id"
    + " LEFT JOIN "
    + " vuscreen_folders vf ON vf.id = vc.folder_id"
    + " LEFT JOIN"
    + " account_management am ON vst.partner = am.id"
    + " LEFT JOIN "
    + " vuscreen_registration vr ON vst.reg_id = vr.reg_id"
    + " where vst.type IN ('video','brand-video') AND vst.sync_date='" + Yesterday + "'"
    + " order by vst.view_datetime desc,vst.sync_datetime"
  db.get().query(query, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      var query1 = "select "
        + " vc.title,"
        + " vc.thumbnail,"
        + " vst.type,"
        // + " vc.genre,"
        + " am.login_id,"
        + " vst.session_id,"
        + " vst.view_android_id,"
        + " vst.device_id,"
        + " vst.version,"
        + " vst.interface,"
        + " vst.model,"
        + " vst.mac,"
        + " vst.reg_id,"
        + " vst.sync_date,"
        + " vst.view_model,"
        + " vst.view_duration view_duration,"
        + " vst.view_datetime,"
        + " vr.source,"
        + " vr.destination,"
        + " vr.vehicle_no,"
        + " vst.sync_datetime,"
        + " vst.user_agent"
        + " from"
        + " vuscreen_tracker vst"
        + " LEFT JOIN"
        + " vuscreen_store_content vc ON vst.view_id = vc.content_id"
        + " LEFT JOIN"
        + " account_management am ON vst.partner = am.id"
        + " LEFT JOIN "
        + " vuscreen_registration vr ON vst.reg_id = vr.reg_id"
        + " where vst.type= 'zip' AND vst.sync_date='" + Yesterday + "'"
        + " order by vst.view_datetime desc,vst.sync_datetime"
      db.get().query(query1, function (err1, result1) {
        if (err1) {
          console.log(err1)
        } else {
          let playFields = ["reg_id", "source", "destination", "mac", "vehicle_no", "session_id", "device_id", "title", "genre", "type", "view_model", "view_duration", "model", "view_android_id", "interface", "version", "view_datetime", "sync_date", "user_agent"];
          let gamesFields = ["reg_id", "source", "destination", "mac", "vehicle_no", "session_id", "device_id", "title", "type", "view_model", "view_duration", "model", "view_android_id", "interface", "version", "view_datetime", "sync_date", "user_agent"];
          var csvPlay = json2csv({ data: result, fields: playFields });
          var csvGames = json2csv({ data: result1, fields: gamesFields });
          var array = []
          array.push({ key: 'playLogs', value: csvPlay }, { key: 'gameLogs', value: csvGames })
          let url = [];
          for (var i = 0; i < array.length; i++) {
            let key = array[i].key;
            fs.writeFile(config.root + '/server/api/cron/' + array[i].key + '.csv', array[i].value, function (err) {
              if (err) {
                throw err;
              } else {
                console.log('file saved');
                let destPath = key + '_' + moment(new Date()).format('YYYY-MM-DD') + ".csv"
                fs.readFile(config.root + '/server/api/cron/' + key + '.csv', function (err, data) {
                  if (err) throw err; // Something went wrong!
                  s3Client.putObject({
                    Bucket: s3_details.bucket,
                    Key: destPath,
                    ACL: 'public-read',
                    Body: data
                  }, function (err, data) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log("success")
                      url.push("https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Automated_Reports" + '/' + destPath)
                    }
                  });
                });
              }
            });
          };
          setTimeout(function () {
            let html = "<html><head>"
            html += "<style>"
            html += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
            html += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}"
            html += "tr:nth-child(even) {background-color: #dddddd;}</style></head>"
            html += "<h4>Dear Recipients,</h4>"
            html += "<h4>Please click below URL's to open the reports.</h4>"
            html += "<h4>" + url[0] + "</h4>"
            html += "<h4>" + url[1] + "</h4>"
            html += "<br><h5>Thanks & Regards</h5><h5>Mobi Sign Pvt Ltd.</h5></html>"
            let subject = Yesterday + " - Video & Game Time Spent Logs"
            let email = 'deepak.kumar@mobisign.co.in,product@mobisign.co.in,monali.monalisa@mobisign.co.in,ashyin.thakral@mobisign.co.in,kedargdr@gmail.com'
            // let email = 'kedargdr@gmail.com,deepak.kumar@mobisign.co.in'
            EM.dispatchEmail(email, subject, html, "timeSpent", function (e) {
              console.log(e)
            })
          }, 15000)
        }
      })
    }
  })
}

/*  Get Monday Friday Email with host ID view count user count.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 16/09/2020
*/
exports.countByHostCron = function () {
  let d = new Date();
  let d1 = d.setDate(d.getDate() - 1);
  let d2 = d.setDate(d.getDate() - 6);
  d1 = moment(d1).format('YYYY-MM-DD').toString();
  d2 = moment(d2).format('YYYY-MM-DD').toString();
  let query = "SELECT vr.vehicle_no AS HostID, COUNT(1) Count, COUNT(DISTINCT vst.mac) User"
    + " FROM vuscreen_tracker vst"
    + " LEFT JOIN vuscreen_registration vr ON vst.reg_id = vr.reg_id"
    + " WHERE "
    + " vr.vehicle_no != ''"
    + " GROUP BY vr.vehicle_no"
    + " ORDER BY COUNT desc"
  db.get().query(query, function (err, dataArray) {
    if (err) {
      console.log(err)
    } else {
      var html = "<html><head>"
      html += "<style>"
      html += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
      html += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}"
      html += "tr:nth-child(even) {background-color: #dddddd;}</style></head>"
      html += "<h4>Dear Recipients,</h4>"
      html += "<h4>Please find below table by Host .</h4><table>"
      html += "<thead><tr>"
      html += "<th>Host Id</th><th>View Count</th><th>User Count</th>"
      html += "</tr></thead><tbody>"

      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index];
        html += "<tr>"
        html += "<td><b>" + element.HostID + "</b></td>"
        html += "<td>" + element.Count + "</td>"
        html += "<td><b>" + element.User + "</b></td>"
        html += "</tr>"
      }
      html += "</tbody></table>";
      html += "<br><br><h5>Thanks & Regards</h5><h5>Mobi Sign Pvt Ltd.</h5></html>"
      let subject = "Host Wise activity"
      let email = 'manoj.gupta@mobisign.co.in,deepak.kumar@mobisign.co.in,product@mobisign.co.in,monali.monalisa@mobisign.co.in,ashyin.thakral@mobisign.co.in,kedargdr@gmail.com'
      // let email = 'kedargdr@gmail.com,deepak.kumar@mobisign.co.in'
      EM.dispatchEmail(email, subject, html, "host", function (e) {
        console.log(e)
      })
    }
  })
}

/*  Get Daily Email with monthly date Host ID UU Video Played Game Played Video time spent Games time spent.
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 19/09/2020
*/
const jsonexport = require('jsonexport');
exports.MTDCron = function () {
  let d = new Date();
  let d1 = d.setDate(d.getDate() - 1);
  let d2 = d.setDate(d.getDate() - 6);
  d1 = moment(d1).format('YYYY-MM-DD').toString();
  d2 = moment(d2).format('YYYY-MM-DD').toString();
  var firstDate = moment(new Date()).format('YYYY-MM') + '-01';
  let query = "SELECT vst.sync_date,vr.vehicle_no HostID,COUNT(DISTINCT mac) UU,"
    + " CASE"
    + "   WHEN vst.interface = 'IOS' THEN Round((COUNT(1) / 2))"
    + "   ELSE COUNT(1)"
    + " END AS Played,"
    + "  CASE"
    + "  WHEN vst.interface = 'IOS' THEN Round((SUM(view_duration) / 2))"
    + "  ELSE SUM(view_duration)"
    + " END AS TimeSpent,"
    + " vst.type Type,"
    + " vst.interface,SUBSTRING_INDEX(SUBSTRING_INDEX(user_agent, '(', 2), ')', 1) AS user_agent"
    + " FROM"
    + " vuscreen_tracker vst"
    + " LEFT JOIN"
    + " vuscreen_registration vr ON vst.reg_id = vr.reg_id"
    + " WHERE"
    + " vst.sync_date >='" + firstDate + "' AND vst.sync_date <= '" + d1 + "'"
    + "   AND vst.type = 'video'"
    + "  AND vr.vehicle_no NOT REGEXP '[A-Z ]'"
    + " GROUP BY vr.vehicle_no , vst.sync_date"
    + " ORDER BY vst.sync_date"
  let query1 = "SELECT vst.sync_date,vr.vehicle_no HostID,COUNT(DISTINCT mac) UU,"
    + " CASE"
    + "   WHEN vst.interface = 'IOS' THEN Round((COUNT(1) / 2))"
    + "   ELSE COUNT(1)"
    + " END AS Played,"
    + "  CASE"
    + "  WHEN vst.interface = 'IOS' THEN Round((SUM(view_duration) / 2))"
    + "  ELSE SUM(view_duration)"
    + " END AS TimeSpent,"
    + " vst.type Type,"
    + " vst.interface,SUBSTRING_INDEX(SUBSTRING_INDEX(user_agent, '(', 2), ')', 1) AS user_agent"
    + " FROM"
    + " vuscreen_tracker vst"
    + " LEFT JOIN"
    + " vuscreen_registration vr ON vst.reg_id = vr.reg_id"
    + " WHERE"
    + " vst.sync_date >='" + firstDate + "' AND vst.sync_date <= '" + d1 + "'"
    + "   AND vst.type ='zip'"
    + "  AND vr.vehicle_no NOT REGEXP '[A-Z ]'"
    + " GROUP BY vr.vehicle_no , vst.sync_date"
    + " ORDER BY vst.sync_date"
  db.get().query(query, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      db.get().query(query1, function (err1, result1) {
        if (err1) {
          console.log(err1)
        } else {
          let fields = ["sync_date", "HostID", "UU", "Played", "TimeSpent", "Type", "interface", "user_agent"];
          var csvPlay = json2csv({ data: result, fields: fields });
          var csvGames = json2csv({ data: result1, fields: fields });
          var array = []
          array.push({ key: 'MTDplayLogs', value: csvPlay }, { key: 'MTDgameLogs', value: csvGames })
          let url = [];
          for (var i = 0; i < array.length; i++) {
            let key = array[i].key;
            fs.writeFile(config.root + '/server/api/cron/' + array[i].key + '.csv', array[i].value, function (err) {
              if (err) {
                throw err;
              } else {
                console.log('file saved');
                let destPath = key + '_' + moment(new Date()).format('YYYY-MM-DD') + ".csv"
                fs.readFile(config.root + '/server/api/cron/' + key + '.csv', function (err, data) {
                  if (err) throw err; // Something went wrong!
                  s3Client.putObject({
                    Bucket: s3_details.bucket,
                    Key: destPath,
                    ACL: 'public-read',
                    Body: data
                  }, function (err, data) {
                    if (err) {
                      console.log(err)
                    } else {
                      console.log("success")
                      url.push("https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Automated_Reports" + '/' + destPath)
                    }
                  });
                });
              }
            });
          };
          setTimeout(function () {
            let html = "<html><head>"
            html += "<style>"
            html += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
            html += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}"
            html += "tr:nth-child(even) {background-color: #dddddd;}</style></head>"
            html += "<h4>Dear Recipients,</h4>"
            html += "<h4>Please click below URL's to open the reports.</h4>"
            html += "<h4>" + url[0] + "</h4>"
            html += "<h4>" + url[1] + "</h4>"
            html += "<br><h5>Thanks & Regards</h5><h5>Mobi Sign Pvt Ltd.</h5></html>"
            let subject = "Videos & Game UU, Played, Time Spent Data"
            let email = 'deepak.kumar@mobisign.co.in,product@mobisign.co.in,monali.monalisa@mobisign.co.in,ashyin.thakral@mobisign.co.in,kedargdr@gmail.com'
            // let email = 'kedargdr@gmail.com,deepak.kumar@mobisign.co.in'
            EM.dispatchEmail(email, subject, html, "MTD", function (e) {
              console.log(e)
            })
          }, 10000)
        }
      })
    }
  })
}

/*  Get Daily Email with server session
    @Authentication ----> by session key
    @Authorization ----> Access Controll Logic
    Author : Kedar Gadre
    Date : 24/09/2020
*/
exports.serverSessionCron = async function (req, flag) {
  return new Promise(async function (resolve, reject) {
    // the function is executed automatically when the promise is constructed
    // after 1 second signal that the job is done with the result "done"
    var filter = '';
    let d1, d2;
    if (flag) {
      if (req.query.hostId != "undefined") { filter = " AND vr.vehicle_no ='" + req.query.hostId + "'" }
      d2 = moment(req.query.startDate).format('YYYY-MM-DD').toString();
      d1 = moment(req.query.endDate).format('YYYY-MM-DD').toString();
    } else {
      let d = new Date();
      d1 = d.setDate(d.getDate() - 1);
      d2 = d.setDate(d.getDate() - 6);
      d1 = moment(d1).format('YYYY-MM-DD').toString();
      d2 = moment(d2).format('YYYY-MM-DD').toString();
    }
    let query = "SELECT distinct (convert(ve.view_datetime,datetime)) as ts ,ve.view_date sync_date,vr.vehicle_no as HostID,ve.event"
      + " FROM vuscreen_events ve"
      + " LEFT JOIN vuscreen_registration vr ON ve.device_id = vr.device_id"
      + " WHERE ve.sync_date >= '" + d2 + "' AND ve.sync_date <= '" + d1 + "' AND ve.user = 'server'"
      + " AND ve.event NOT IN ('start', 'download', 'stop', 'delete') AND ve.event NOT Like 'charging%'"
      + " AND vr.vehicle_no != '' " + filter
      + " GROUP BY ve.view_datetime, vr.vehicle_no, ve.event ORDER BY ve.sync_datetime"
    console.log(query)
    db.get().query(query, function (error, dataArray) {
      if (error) {
        console.log(error)
      } else {
        let finalArr = []
        let dataObj = {
          sync_date: null, HostID: null, cycle: null, wifiLogin: null, start_date: null, start_time: null, start_battery: null,
          stop_date: null, stop_time: null, stop_battery: null, start_stop_duration: null, battery_consumed: null
        }
        if (dataArray.length > 0) {
          let deviceMap = new Map();
          for (let i = 0; i < dataArray.length; i++) {
            const element = dataArray[i];
            try {
              let eventType = element.event.split("|")[0]
              let batteryPer = element.event.split(":")[1].split("%")[0]
              let wifiLogin = element.event.split("% |")[1]
              if (dataObj.sync_date == null) {
                if (eventType.trim() == "start") {
                  dataObj.sync_date = element.sync_date
                  dataObj.HostID = element.HostID;
                  var startDate = element.ts
                  dataObj.start_date = element.ts.split(" ")[0]
                  dataObj.start_time = element.ts.split(" ")[1]
                  dataObj.start_battery = batteryPer + "%"
                  dataObj.wifiLogin = wifiLogin
                }
              } else {
                if (dataObj.HostID == element.HostID && eventType.trim() != "start") {
                  if (wifiLogin != 0) {
                    let endDate = element.ts
                    dataObj.stop_date = element.ts.split(" ")[0]
                    dataObj.stop_time = element.ts.split(" ")[1]
                    dataObj.stop_battery = batteryPer + "%"
                    dataObj.wifiLogin = wifiLogin
                    if (deviceMap.has(element.sync_date + '_' + element.HostID)) {
                      let value = deviceMap.get(element.sync_date + '_' + element.HostID)
                      dataObj.cycle = value + 1
                      deviceMap.set(element.sync_date + '_' + element.HostID, value + 1)
                    } else {
                      deviceMap.set(element.sync_date + '_' + element.HostID, 1)
                      dataObj.cycle = 1
                    }
                    // need to cal time duration & battery consumed
                    let difference = diff_minutes(new Date(startDate), new Date(endDate))
                    dataObj.start_stop_duration = difference
                    let battery_consumed = dataObj.start_battery.replace("%", "") - dataObj.stop_battery.replace("%", "")
                    dataObj.battery_consumed = battery_consumed + "%"
                    finalArr.push(dataObj)
                    dataObj = {
                      sync_date: null, HostID: null, cycle: null, wifiLogin: null, start_date: null, start_time: null, start_battery: null,
                      stop_date: null, stop_time: null, stop_battery: null, start_stop_duration: null, battery_consumed: null
                    }
                  }
                  else{
                    dataObj = {
                      sync_date: null, HostID: null, cycle: null, wifiLogin: null, start_date: null, start_time: null, start_battery: null,
                      stop_date: null, stop_time: null, stop_battery: null, start_stop_duration: null, battery_consumed: null
                    }
                  }
                } else if (eventType.trim() == "start") {
                  // dataObj.stop_date = 0
                  // dataObj.stop_time = 0
                  // dataObj.stop_battery = 0 + "%"
                  // dataObj.wifiLogin = 0
                  // dataObj.start_stop_duration = 0
                  // dataObj.battery_consumed = 0 + "%"
                  // finalArr.push(dataObj)
                  // dataObj = {
                  //   sync_date: null, HostID: null, cycle: null, wifiLogin: null, start_date: null, start_time: null, start_battery: null,
                  //   stop_date: null, stop_time: null, stop_battery: null, start_stop_duration: null, battery_consumed: null
                  // }
                  dataObj.sync_date = element.sync_date
                  dataObj.HostID = element.HostID;
                  var startDate = element.ts
                  dataObj.start_date = element.ts.split(" ")[0]
                  dataObj.start_time = element.ts.split(" ")[1]
                  dataObj.start_battery = batteryPer + "%"
                  dataObj.wifiLogin = wifiLogin
                  // if (deviceMap.has(element.sync_date + '_' + element.HostID)) {
                  //   let value = deviceMap.get(element.sync_date + '_' + element.HostID)
                  //   dataObj.cycle = value + 1
                  //   deviceMap.set(element.sync_date + '_' + element.HostID, value + 1)
                  // } else {
                  //   deviceMap.set(element.sync_date + '_' + element.HostID, 1)
                  //   dataObj.cycle = 1
                  // }
                }
              }
              if (i + 1 == dataArray.length) {
                let fields = ["sync_date", "HostID", "cycle", "wifiLogin", "start_date", "start_time", "start_battery", "stop_date", "stop_time", "stop_battery", "start_stop_duration", "battery_consumed"];
                let csvDau = json2csv({ data: finalArr, fields: fields });
                var array = []
                array.push({ key: 'serversession', value: csvDau })
                if (flag) {
                  console.log("length of " + finalArr.length)
                  resolve(finalArr)
                } else {
                  for (let i = 0; i < array.length; i++) {
                    fs.writeFile(config.root + '/server/api/cron/' + array[i].key + '.csv', array[i].value, function (err) {
                      if (err) {
                        throw err;
                      } else {
                        console.log('file saved');
                      }
                    });
                  }
                  let destPath = "serversession_" + moment(new Date()).format('YYYY-MM-DD') + ".csv"
                  fs.readFile(config.root + '/server/api/cron/serversession.csv', function (err, data) {
                    if (err) throw err; // Something went wrong!
                    s3Client.putObject({
                      Bucket: s3_details.bucket,
                      Key: destPath,
                      ACL: 'public-read',
                      Body: data
                    }, function (err, data) {
                      if (err) {
                        console.log(err)
                      } else {
                        console.log("success")
                        let url = "https://mobisign-bucket.s3.ap-south-1.amazonaws.com/Automated_Reports" + '/' + destPath
                        setTimeout(function () {
                          var html = "<html><head>"
                          html += "<style>"
                          html += "table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}"
                          html += "td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}"
                          html += "tr:nth-child(even) {background-color: #dddddd;}</style></head>"
                          html += "<h4>Dear Recipients,</h4>"
                          html += "<h4>Please click below URL to open the report.</h4>"
                          html += "<h4>" + url + "</h4>"
                          html += "<br><h5>Thanks & Regards</h5><h5>Mobi Sign Pvt Ltd.</h5></html>"
                          let subject = "Last 7 Server Sessions activity"
                          // var email = 'deepak.kumar@mobisign.co.in,product@mobisign.co.in,monali.monalisa@mobisign.co.in,ashyin.thakral@mobisign.co.in,kedargdr@gmail.com,vishal.garg@mobisign.co.in'
                          var email = 'kedargdr@gmail.com'
                          EM.dispatchEmail(email, subject, html, "serversession", function (e) {
                            console.log(e)
                          })
                        }, 10000)
                      }
                    });
                  });
                }
              }
            } catch (error) {
              console.log(error)
            }

          }
        } else {
          resolve([])
        }

      }
    })
  });

}

function diff_minutes(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));

}
