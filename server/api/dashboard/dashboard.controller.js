'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var db_vp = require('../../config/mysql_vp')
var moment = require('moment');


exports.get_server_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' ) total_client,"
        + " (select count(distinct device_id) FROM vuscreen_events where partner = '" + req.user.partner_id + "' AND user = 'server' AND event like 'start%') total_server,"
        + " (select count(distinct mac ) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_client,"
        + " (select count(distinct reg_id) FROM vuscreen_events where partner = '" + req.user.partner_id + "'  AND sync_date = '" + currentDate + "' AND user = 'server' AND event like 'start%') today_server,"
        + " (select count(distinct mac ) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') y_client,"
        + " (select count(distinct reg_id) FROM vuscreen_events where partner = '" + req.user.partner_id + "'  AND sync_date = '" + Yesterday + "' AND user = 'server' AND event like 'start%') y_server"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}


exports.get_vp_server_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var query = "select "
        + " (select count(distinct android_id) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND tracking_type='tracking_conn') total_client,"
        + " (select count(distinct reg_id) FROM vupoint_file where partner = '" + req.user.partner_id + "') total_server,"
        + " (select count(distinct android_id ) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND tracking_type='tracking_conn') today_client,"
        + " (select count(distinct reg_id) FROM vupoint_file where partner = '" + req.user.partner_id + "'  AND sync_date = '" + currentDate + "') today_server"
    db_vp.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_played_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(1) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "') total_played,"
        + " (select count(1) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_played,"
        + " (select count(1) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') y_played"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_vp_played_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var query = "select "
        + " (select count(1) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND duration>0) total_played,"
        + " (select count(1) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND duration>0) today_played"
    db_vp.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}


exports.get_duration_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select sum(platform_duration / 3600) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "') total_duration,"
        + " (select sum(platform_duration / 3600) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_duration,"
        + " (select sum(platform_duration / 3600) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') y_duration"
    db.get().query(query, function (err, doc) {
    
        if (err) { return handleError(res, err); }
        
        return res.status(200).json(doc);
    })
}


// exports.get_Platform_duration_ysday = function (req, res) {
//     console.log("fadjklhldas");
//     var currentDate = moment(new Date()).format('YYYY-MM-DD');
//     var d = new Date();
//     d.setDate(d.getDate() - 1);
//     var Yesterday = moment(d).format('YYYY-MM-DD').toString()
//     var query1 = " SELECT distinct  a.mac, a.platform_duration, a.view_datetime,a.sync_datetime from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + Yesterday + "' ORDER BY a.id DESC";
//     db.get().query(query1, function (err, doc) {
//       if (err) { return handleError(res, err); }
//       else {
//         var query = "SELECT distinct  a.mac from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + Yesterday + "' ORDER BY a.id DESC";
//         db.get().query(query, function (err, doc1) {
//           if (err) { return handleError(res, err); }
//           else {
//             var data = 0
//                             var ysday = 0
//                             for (let k = 0; k < doc1.length; k++) {
//                               var count = 0;
//                               var data = "";
//                               for (let i = 0; i < doc.length; i++) {
//                                 if (doc1[k].mac == doc[i].mac) {
//                                   if (doc[i].platform_duration != "" && doc[i].platform_duration != NaN && doc[i].platform_duration != "undefined" && doc[i].platform_duration != null) {
//                                     data = doc[i].platform_duration;
//                                     count = 1;
//                                     break;
//                                   }
//                                 }
//                               }
//                               if (count == 1) {
//                                 ysday += parseInt(data);
//                               }
//                             }
//                             console.log("yes");
//                             console.log(ysday / 3600);
//                             console.log("yes");
//                             let dt=(ysday / 3600).toFixed(2);
//                             let dataa=
//                             {
//                                 ysday:dt
//                             };
//                             return res.status(200).json(dataa);
//           }
//         })
//       }
//     })

  
//     // return res.status(200).json(doc);
  
//   }
  
  
   
// exports.get_Platform_duration_today = function (req, res) {
//     console.log("fadjklhldas");
//     var currentDate = moment(new Date()).format('YYYY-MM-DD');
//     var d = new Date();
//     d.setDate(d.getDate() - 1);
//     var Yesterday = moment(d).format('YYYY-MM-DD').toString()
       
//             var query2 = " SELECT distinct  a.mac, a.platform_duration, a.view_datetime,a.sync_datetime from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + currentDate + "' ORDER BY a.id DESC";
//             db.get().query(query2, function (err, doc2) {
//               if (err) { return handleError(res, err); }
//               else {
//                 var query3 = "SELECT distinct  a.mac from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + currentDate + "' ORDER BY a.id DESC";
//                 db.get().query(query3, function (err, doc3) {
//                   if (err) { return handleError(res, err); }
//                   else {
                    
//                     var data = 0
//                     var tday = 0
//                     for (let j = 0; j < doc3.length; j++) {
//                       var count = 0;
//                       var data = "";
//                       for (let l = 0; l < doc2.length; l++) {
//                         if (doc3[j].mac == doc2[l].mac) {
//                           if (doc2[l].platform_duration != "" && doc2[l].platform_duration != NaN && doc2[l].platform_duration != "undefined" && doc2[l].platform_duration != null) {
//                             data = doc2[l].platform_duration;
//                             count = 1;
//                             break;
//                           }
//                         }
//                       }
//                       if (count == 1) {
//                         tday += parseInt(data);
//                       }
//                     }
//                     console.log(tday / 3600);
//                     console.log("today");
//                     let dt=(tday / 3600).toFixed(2);
//                     let dataa=
//                     {
//                         tsday:dt
//                     };
//                     console.log("dataa");
//                         console.log(dataa);
                         
//                     return res.status(200).json(dataa);
//                   }
//                 })
//               }
//             })
         
//     }

exports.get_vp_duration_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var query = "select "
        + " (select sum(duration / 3600) FROM vupoint_file where partner = '" + req.user.partner_id + "') total_duration,"
        + " (select sum(duration / 3600) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_duration"
    db_vp.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}


exports.get_currmonth_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var firstDate = moment(new Date()).format('YYYY-MM') + '-01';
    var query = "select "
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date >= '" + firstDate + "' AND sync_date <= '" + currentDate + "') month_mau,"
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_dau"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_vp_currmonth_static_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var firstDate = moment(new Date()).format('YYYY-MM') + '-01';
    var query = "select "
        + " (select count(distinct android_id) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date >= '" + firstDate + "' AND sync_date <= '" + currentDate + "') month_mau,"
        + " (select count(distinct android_id) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_dau"
    db_vp.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_premonth_static_count = function (req, res) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var prevMonthLastDate = moment(new Date(d.getFullYear(), d.getMonth(), 0)).format('YYYY-MM-DD').toString();
    var prevMonthFirstDate = moment(new Date(d.getFullYear() - (d.getMonth() > 0 ? 0 : 1), (d.getMonth() - 1 + 12) % 12, 1)).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date >= '" + prevMonthFirstDate + "' AND sync_date <= '" + prevMonthLastDate + "') premonth_mau,"
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') yesterday_dau"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_vp_premonth_static_count = function (req, res) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var prevMonthLastDate = moment(new Date(d.getFullYear(), d.getMonth(), 0)).format('YYYY-MM-DD').toString();
    var prevMonthFirstDate = moment(new Date(d.getFullYear() - (d.getMonth() > 0 ? 0 : 1), (d.getMonth() - 1 + 12) % 12, 1)).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(distinct android_id) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date >= '" + prevMonthFirstDate + "' AND sync_date <= '" + prevMonthLastDate + "') premonth_mau,"
        + " (select count(distinct android_id) FROM vupoint_file where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') yesterday_dau"
    db_vp.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_totaClick_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' ) total_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') t_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') y_fpu"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_fileplayed_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'video') total_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'video') t_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'video') y_fpu"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_fnbClick_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND menu = 'fnb') total_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND menu = 'fnb') t_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND menu = 'fnb') y_fpu"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_audioClick_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'audio') total_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "'  AND TYPE = 'audio') t_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'audio') y_fpu"
    db.get().query(query, function (err, doc) {
        
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_magzineClick_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'pdf') total_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'pdf') t_fpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'pdf') y_fpu"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_gameplayed_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'zip') total_gpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'zip') t_gpu,"
        + " (select IFNULL(ROUND(count(1)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'zip') y_gpu"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_watch_login_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "') total_played,"
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "') today_played,"
        + " (select count(distinct mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "') y_played"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_wifi_login_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "SELECT  a.event, a.view_datetime, a.journey_id,unique_mac_address FROM morevidya.vuscreen_events a WHERE a.sync_date = '"+currentDate+"' AND a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC"
    db.get().query(query, function (err, today) {
        if (err) { return handleError(res, err); }
        else{
            var query1 = "SELECT  a.event, a.view_datetime, a.journey_id,unique_mac_address FROM morevidya.vuscreen_events a WHERE a.sync_date = '"+Yesterday+"' AND a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC"
        db.get().query(query1, function (err, yday) {
        if (err) { return handleError(res, err); }
        else{
            var query2 = "SELECT  a.event, a.view_datetime, a.journey_id,unique_mac_address FROM morevidya.vuscreen_events a  WHERE a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC"
            db.get().query(query2, function (err, total) {
            if (err) { return handleError(res, err); }
            else{
                var query3 = "SELECT count(distinct a.sync_date) as unique_day FROM morevidya.vuscreen_events a  WHERE a.event != 'download' AND a.event != 'charging' ORDER BY a.id DESC"
            db.get().query(query3, function (err, totalday) {
            if (err) { return handleError(res, err); }
            else{
                var today_user = 0
                var yday_user = 0
                var total_user = 0
                var data = ""
                let wifiMap = new Map();
                // let a =  []
                
                for (let i = 0; i < today.length; i++) {
                  data += today[i].unique_mac_address + ",";
                  // console.log(doc[i].unique_mac_address)
          
                  if (today.length == i + 1) {
                    var data1 = data.split(',');
                    // console.log(data1.length);
          
                    for (let j = 0; j < data1.length; j++) {
                      const element = data1[j];
          
                      wifiMap.set(element, element)
                     
                    
                      
                    }
                    // console.log(wifiMap);
                    //  console.log(wifiMap.size)
                     today_user=wifiMap.size
                  }
                }
    
    
                var datas = ""
                let wifiMaps = new Map();
                // let a =  []
              
                for (let i = 0; i < yday.length; i++) {
                    datas += yday[i].unique_mac_address + ",";
                  // console.log(doc[i].unique_mac_address)
          
                  if (yday.length == i + 1) {
                    var data1 = datas.split(',');
                    // console.log(data1.length);
          
                    for (let j = 0; j < data1.length; j++) {
                      const element = data1[j];
          
                      wifiMaps.set(element, element)
                     
                    
                      
                    }
                    // console.log(wifiMap);
                    //  console.log(wifiMap.size)
                     yday_user=wifiMaps.size
                  }
                }
    
                
                var datat = ""
                let wifiMapsd = new Map();
                // let a =  []
              
                for (let i = 0; i < total.length; i++) {
                    datat += total[i].unique_mac_address + ",";
                  // console.log(doc[i].unique_mac_address)
          
                  if (total.length == i + 1) {
                    var data1 = datat.split(',');
                    // console.log(data1.length);
          
                    for (let j = 0; j < data1.length; j++) {
                      const element = data1[j];
          
                      wifiMapsd.set(element, element)
                     
                    
                      
                    }
                    // console.log(wifiMap);
                     console.log(wifiMapsd.size)
                    total_user=wifiMapsd.size
                  }
                }
    var totalavg=(total_user/totalday[0].unique_day).toFixed(2);
    
                    var doc={
                        tlogin:today_user,
                        ylogin:yday_user,
                        ttlogin:total_user,
                        avg: totalavg
                    }
                   
                return res.status(200).json(doc);
            }
            })
            }
            })
        }
            })
        }
            
        
      
    })
}
 
exports.get_gametime_peruser_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'zip') total_gtpu,"
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'zip') t_gtpu,"
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'zip') y_gtpu,"
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE = 'video') total_ptpu,"
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'video') t_ptpu,"
        + " (select IFNULL(ROUND(SUM(view_duration/60)/ COUNT(DISTINCT mac), 1),0) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'video') y_ptpu"
    console.log(query)
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}

exports.get_gameplay_overlap_count = function (req, res) {
    var currentDate = moment(new Date()).format('YYYY-MM-DD');
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var Yesterday = moment(d).format('YYYY-MM-DD').toString()
    var query = "select "
        + " (select count(DISTINCT mac)  FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND TYPE IN ('video','zip')) total_gpolap,"
        + " (select count(DISTINCT mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'zip') t_golap,"
        + " (select count(DISTINCT mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'zip') y_golap,"
        + " (select count(DISTINCT mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + currentDate + "' AND TYPE = 'video') t_polap,"
        + " (select count(DISTINCT mac) FROM vuscreen_tracker where partner = '" + req.user.partner_id + "' AND sync_date = '" + Yesterday + "' AND TYPE = 'video') y_polap"
    db.get().query(query, function (err, doc) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(doc);
    })
}


exports.get_Platform_durations = function (req, res, next) {
    async function app() {
        var currentDate = moment(new Date()).format('YYYY-MM-DD');
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var Yesterday = moment(d).format('YYYY-MM-DD').toString()
        let doc = await insertSignup(Yesterday);
        let doc1 = await insertSignup1(Yesterday);
      let doc2 = await insertSignup(currentDate);
      let doc3 = await insertSignup1(currentDate);
      let doc4 = await insertSignup2(doc2,doc3);
      let doc5 = await insertSignup3(doc,doc1);
     
      let dataa=
      {
          ysday:doc5.ysday,
          tsday:doc4.tsday
      };
         return res.status(200).json(dataa);
      
    //   res.status("200").json(insert);
  
    }
    app();
  
  };
  

  function insertSignup(currentDate) {
    return new Promise(function (myResolve, myReject) {
      let query = "SELECT distinct  a.mac, a.platform_duration, a.view_datetime,a.sync_datetime from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + currentDate + "' ORDER BY a.id DESC";  
      db.get().query(query, function (err, doc) {
        if (err) { myResolve(err) }
        else {
          myResolve(doc);
        }
      })
  
    });
  
  }
  function insertSignup1(currentDate) {
    return new Promise(function (myResolve, myReject) {
      let query = "SELECT distinct  a.mac from morevidya.vuscreen_tracker a JOIN vuscreen_registration b ON a.device_id = b.device_id WHERE a.sync_date = '" + currentDate + "' ORDER BY a.id DESC";  
      db.get().query(query, function (err, doc) {
        if (err) { myResolve(err) }
        else {
          myResolve(doc);
        }
      })
  
    });
  
  }
  function insertSignup2(doc2,doc3) {
    return new Promise(function (myResolve, myReject) {
      
        var data = 0
        var tday = 0
        for (let j = 0; j < doc3.length; j++) {
          var count = 0;
          var data = "";
          for (let l = 0; l < doc2.length; l++) {
            if (doc3[j].mac == doc2[l].mac) {
              if (doc2[l].platform_duration != "" && doc2[l].platform_duration != NaN && doc2[l].platform_duration != "undefined" && doc2[l].platform_duration != null) {
                data = doc2[l].platform_duration;
                count = 1;
                break;
              }
            }
          }
          if (count == 1) {
            tday += parseInt(data);
          }
        }
        // console.log(tday / 3600);
        // console.log("today");
        let dt=(tday / 3600).toFixed(2);
        let dataa=
        {
            tsday:dt
        };
    
            console.log(dataa);
            myResolve(dataa);
  
    });
  
  }
  function insertSignup3(doc2,doc3) {
    return new Promise(function (myResolve, myReject) {
      
        var data = 0
        var yday = 0
        for (let j = 0; j < doc3.length; j++) {
          var count = 0;
          var data = "";
          for (let l = 0; l < doc2.length; l++) {
            if (doc3[j].mac == doc2[l].mac) {
              if (doc2[l].platform_duration != "" && doc2[l].platform_duration != NaN && doc2[l].platform_duration != "undefined" && doc2[l].platform_duration != null) {
                data = doc2[l].platform_duration;
                count = 1;
                break;
              }
            }
          }
          if (count == 1) {
            yday += parseInt(data);
          }
        }
        // console.log(tday / 3600);
        // console.log("today");
        let dt=(yday / 3600).toFixed(2);
        let dataa=
        {
            ysday:dt
        };
    
            console.log(dataa);
            myResolve(dataa);
  
    });
  
  }
function handleError(res, err) {
    return res.status(500).send(err);
}
