'use strict';

var _ = require('lodash');
var SMS = require('./sms.model');
var helper = require('../../helpers');
var MS = require('../../helpers').sendSMS;
var config = require('../../config/environment');

var moment = require('moment');
var VideoViewModel = require('../videoView/videoView.model');
var dayWiseTarget = 325000;
var monthWiseTarget = 11000000;

              //Manoj K   // Rajesh  // Manoj G
// var Mobile_Numbers = ['8010795112','9811852125','9810772396',
//              // Mainsh     // prashant  // neha   
//              '9873077570','8447731044','9953352241',
//              // shrishty  //vishal     //prakhar
//              '9582736798','9810881743','9891312694',
//              // hemant  //gunjan     //yogi       
//              '9873412238','9899116984','9810644774',
//              // sudham  //kedar        //sahil
//              '9999768571','7042854343','9582340204']

var Mobile_Numbers = ['8010795112','9811852125','7042854343']

var Mobile_Numbers = ['9650379456','8010795112','9811852125','9810772396',
             '9873077570','9891312694','9873412238','9555393999',
             '9873412238','9899116984','9810644774',
             '9999768571','7042854343','9582340204']

var genrate_SMS_Day_Wise  = function(D2D,D1D,target_TillDate,lastFiveDaysWeekAverageData,WeekAvgData) {
  var text = "";
  try{
    debugger;
    var t2v = D2D['_doc'].total.totalView;
    var t1v = D1D['_doc'].total.totalView;
    var perChange = Math.round(((t1v - t2v )/t1v)*100*100)/100;

    var WeekAvg = WeekAvgData.lastFiveWeek.avg.toString() +'/' +WeekAvgData.currentWeek.avg.toString();
    var WeekAvgPer =Math.round(((WeekAvgData.currentWeek.avg - WeekAvgData.lastFiveWeek.avg )/WeekAvgData.currentWeek.avg)*100*100)/100;

    var WeekstreamAvg = WeekAvgData.lastFiveWeek.streamAvg.toString() +'/' +WeekAvgData.currentWeek.streamAvg.toString();
    var WeekstreamAvgPer =Math.round(((WeekAvgData.currentWeek.streamAvg - WeekAvgData.lastFiveWeek.streamAvg )/WeekAvgData.currentWeek.streamAvg)*100*100)/100;

    var WeekcampaignAvg = WeekAvgData.lastFiveWeek.campaignAvg.toString() +'/' +WeekAvgData.currentWeek.campaignAvg.toString();
    var WeekcampaignAvgPer =Math.round(((WeekAvgData.currentWeek.campaignAvg - WeekAvgData.lastFiveWeek.campaignAvg )/WeekAvgData.currentWeek.campaignAvg)*100*100)/100;
    
    var WeekmyMediaAvg = WeekAvgData.lastFiveWeek.myMediaAvg.toString() +'/' +WeekAvgData.currentWeek.myMediaAvg.toString();
    var WeekmyMediaAvgPer =Math.round(((WeekAvgData.currentWeek.myMediaAvg - WeekAvgData.lastFiveWeek.myMediaAvg )/WeekAvgData.currentWeek.myMediaAvg)*100*100)/100;


    var totalAverage = 0.0;
    var cAverage = 0.0;
    var sAverage = 0.0;
    var mAverage = 0.0;

    var DWV = lastFiveDaysWeekAverageData.totalAverage.toString() + '/' + t1v.toString();
    var DWVchanges = Math.round(((t1v - lastFiveDaysWeekAverageData.totalAverage )/t1v)*100*100)/100;


    var s2v = D2D['_doc'].stream.totalView;
    var s1v = D1D['_doc'].stream.totalView;
    var perStreamChange = Math.round(((s1v - s2v )/s1v)*100*100)/100;

    var DWSV = lastFiveDaysWeekAverageData.sAverage.toString() + '/' + s1v.toString();
    var DWSVchanges = Math.round(((s1v - lastFiveDaysWeekAverageData.sAverage )/s1v)*100*100)/100;


    var c2v = D2D['_doc'].campaign.totalView;
    var c1v = D1D['_doc'].campaign.totalView;
    var perCampaingChange = Math.round(((c1v - c2v )/c1v)*100*100)/100;

    var DWCV = lastFiveDaysWeekAverageData.cAverage.toString() + '/' + c1v.toString();
    var DWCVchanges = Math.round(((c1v - lastFiveDaysWeekAverageData.cAverage )/c1v)*100*100)/100;


    var my2v = D2D['_doc'].myMedia.totalView;
    var my1v = D1D['_doc'].myMedia.totalView;
    var perMyMediaChange = Math.round(((my1v - my2v )/my1v)*100*100)/100;

    var DWMV = lastFiveDaysWeekAverageData.mAverage.toString() + '/' + my1v.toString();
    var DWMVchanges = Math.round(((my1v - lastFiveDaysWeekAverageData.mAverage )/my1v)*100*100)/100;

    var balanceDays = helper.balanceDaysInMonth(D1D['_doc'].date);
    var RDTR =  Math.round((monthWiseTarget - target_TillDate)/balanceDays)
    var perRDTR =  Math.round(((RDTR/t1v)-1)*100*100)/100;
    
    var currentDaysOfMonth = new Date(D1D['_doc'].date).getDate();
    debugger;
    var ProjectedTarget = Math.round((target_TillDate/currentDaysOfMonth)*(balanceDays+currentDaysOfMonth))

    text = 'DVV: '+t2v.toString()+'/'+t1v.toString()+'('+perChange.toString()+'%)' + ',RDTR:'+RDTR.toString()+'('+perRDTR.toString()+'%)';
    text = text +  ',PT:'+ProjectedTarget.toString();

    text = text +  '\nDWV:'+DWV+'('+DWVchanges.toString()+'%)';
    text = text +  '\nWV:'+WeekAvg+'('+WeekAvgPer.toString()+'%)';

    text = text +  '\nMV:'+my2v.toString()+'/'+my1v.toString()+'('+perMyMediaChange.toString()+'%)';
    text = text +  '\nDWMV:'+DWMV+'('+DWMVchanges.toString()+'%)';
    text = text +  '\nMWV:'+WeekmyMediaAvg+'('+WeekmyMediaAvgPer.toString()+'%)';

    text = text +  '\nSV:'+s2v.toString()+'/'+s1v.toString()+'('+perStreamChange.toString()+'%)';
    text = text +  '\nDWSV:'+DWSV+'('+DWSVchanges.toString()+'%)';
    text = text +  '\nSWV:'+WeekstreamAvg+'('+WeekstreamAvgPer.toString()+'%)';

    text = text +  '\nCV:'+c2v.toString()+'/'+c1v.toString()+'('+perCampaingChange.toString()+'%)';
    text = text +  '\nDWCV:'+DWCV+'('+DWCVchanges.toString()+'%)';
    text = text +  '\nCWV:'+WeekcampaignAvg+'('+WeekcampaignAvgPer.toString()+'%)';

    return text;
  }catch(err){
    console.error(err);
    return text;
  }
};



var genrate_SMS_Hour_Wise = function(D2D,D1D,target_TillDate,currentDateTargetTillHours) {
  var text = "";
  try{
    var hour = D2D['_doc'].hour;
    var t2v = D2D['_doc'].total.totalView;
    var t1v = D1D['_doc'].total.totalView;
    var perChange = Math.round(((t1v - t2v )/t1v)*100*100)/100;

    var s2v = D2D['_doc'].stream.totalView;
    var s1v = D1D['_doc'].stream.totalView;
    var perStreamChange = Math.round(((s1v - s2v )/s1v)*100*100)/100;

    var c2v = D2D['_doc'].campaign.totalView;
    var c1v = D1D['_doc'].campaign.totalView;
    var perCampaingChange = Math.round(((c1v - c2v )/c1v)*100*100)/100;

    var my2v = D2D['_doc'].myMedia.totalView;
    var my1v = D1D['_doc'].myMedia.totalView;
    var perMyMediaChange = Math.round(((my1v - my2v )/my1v)*100*100)/100;

    var balanceDays = helper.balanceDaysInMonth(D1D['_doc'].date);
    var RDTR =  Math.round((monthWiseTarget - target_TillDate)/balanceDays)
    var perRDTR =  Math.round(((RDTR/t1v)-1)*100*100)/100;
    
    var balanceTargetofCurrentDate = RDTR - currentDateTargetTillHours;
    // RequiredTargetCurrentDate
    var RTCD = Math.round( balanceTargetofCurrentDate / (23 - parseInt(hour)) );

    // Projected Target In Day 
    var PT = Math.round( (currentDateTargetTillHours / (parseInt(hour)+1)) * 24 )

    var text = 'HVV:('+hour.toString()+') MT:9750000, RDTR:'+RDTR.toString()+',TVV:'+t2v.toString()+'/'+t1v.toString()+'('+perChange.toString()+'%),' + 'PT:' + PT.toString() + ',RHTR:'+RTCD.toString();
    text = text +  '\nMV:'+my2v.toString()+'/'+my1v.toString()+'('+perMyMediaChange.toString()+'%)';
    text = text +  '\nSV:'+s2v.toString()+'/'+s1v.toString()+'('+perStreamChange.toString()+'%)';
    text = text +  '\nCV:'+c2v.toString()+'/'+c1v.toString()+'('+perCampaingChange.toString()+'%)';
    return text;
  }catch(err){
    console.error(err);
    return text;
  }
};

var last_Five_Week_Avg_Vs_with_Current_Week_Avg_Date = function(date, cb) {
  var weekday = moment(new Date(date)).weekday();
  var lastFiveWeekDays = weekday + 1 + 35;
  var d = new Date();
  d.setDate(d.getDate()-lastFiveWeekDays);
  var startDate = moment(d).format('YYYY-MM-DD').toString();
  var endDate =  date;
  VideoViewModel
    .aggregate([{$match : {date:{$gte:startDate,$lte:endDate},hour:{$exists : false}}},
                {$project:{week:{ $dateToString: { format: "%Y-%U", date: { $add: ["$sys_date", 0] } } },
                    total:"$total.totalView",
                    streamTotal:"$stream.totalView",
                    campaignTotal:"$campaign.totalView",
                    myMediaTotal:"$myMedia.totalView",
                    adsTotal:"$myMedia.totalView",
                  }},
                {$group:{ _id :"$week",
                  total : { $sum : "$total" },count : { $sum : 1 },avg : { $avg : "$total" },
                  streamTotal : { $sum : "$streamTotal" },streamAvg : { $avg : "$streamTotal" },
                  campaignTotal : { $sum : "$campaignTotal" },campaignAvg : { $avg : "$campaignTotal" },
                  myMediaTotal : { $sum : "$myMediaTotal" },myMediaAvg : { $avg : "$myMediaTotal" },
                  adsTotal : { $sum : "$adsTotal" },adsAvg : { $avg : "$adsTotal" },

                }},
                {$sort :{_id:-1} }
             ])
    .allowDiskUse(true)
    .exec(function(err,doc){
      if (err) { cb(err,doc) }
        else{
          var currentWeek = {  total : 0,avg : 0,count : 0,
                                streamTotal : 0,streamAvg : 0,
                                campaignTotal : 0,campaignAvg : 0,
                                myMediaTotal : 0,myMediaAvg : 0,
                                adsTotal : 0,adsAvg : 0

                            }
          var lastFiveWeek = {  total : 0,avg : 0,count : 0,
                                streamTotal : 0,streamAvg : 0,
                                campaignTotal : 0,campaignAvg : 0,
                                myMediaTotal : 0,myMediaAvg : 0 ,
                                adsTotal : 0,adsAvg : 0 

                              }
          var total = 0,streamTotal = 0,campaignTotal=0,myMediaTotal=0,adsTotal=0;
          for (var i = 0; i < doc.length; i++) {
            if (i==0) {
              currentWeek.total = doc[i].total;
              currentWeek.count = doc[i].count;
              currentWeek.avg = Math.round(doc[i].avg);

              currentWeek.streamAvg = Math.round(doc[i].streamAvg);
              currentWeek.campaignAvg = Math.round(doc[i].campaignAvg);
              currentWeek.myMediaAvg = Math.round(doc[i].myMediaAvg);
              currentWeek.adsAvg = Math.round(doc[i].adsAvg);

              currentWeek.streamTotal = doc[i].streamTotal;
              currentWeek.campaignTotal = doc[i].campaignTotal;
              currentWeek.myMediaTotal = doc[i].myMediaTotal;
              currentWeek.adsTotal = doc[i].adsTotal;


            }else{
              total = total + doc[i].avg;
              streamTotal = streamTotal + doc[i].streamAvg;
              campaignTotal = campaignTotal + doc[i].campaignAvg;
              myMediaTotal = myMediaTotal + doc[i].myMediaAvg;
              myMediaTotal = adsTotal + doc[i].adsAvg;

            }
          }
          if (doc.length > 1 ) {
            lastFiveWeek.total = Math.round(total);
            lastFiveWeek.count = doc.length - 1;
            lastFiveWeek.avg = Math.round(total / (doc.length - 1));

            lastFiveWeek.streamAvg = Math.round(streamTotal / (doc.length - 1));
            lastFiveWeek.campaignAvg = Math.round(campaignTotal / (doc.length - 1));
            lastFiveWeek.myMediaAvg = Math.round(myMediaTotal / (doc.length - 1));
            lastFiveWeek.adsAvg = Math.round(adsTotal / (doc.length - 1));

          }
          cb(err,{currentWeek:currentWeek,lastFiveWeek:lastFiveWeek})
        }
    })
};
exports.test_last_Five_Week_Avg_Vs_with_Current_Week_Avg_Date = function(req, res) {
  // send_sms_video_view_daily({firstLastDate:'2016-12-19',secondLastDate:'2016-12-18'},function(err,doc){
  //   return res.status(200).json(doc);
  // })
  last_Five_Week_Avg_Vs_with_Current_Week_Avg_Date('2016-12-21',function(err,doc){
    return res.status(200).json(doc);
  })
};
var target_achieved_on_this_Month = function(month, cb) {
  VideoViewModel
    .aggregate([{$match : {yearmonth : month,hour:{$exists : false}}},
                {$project:{total:"$total.totalView"} },
                {$group:{ _id :"",total : { $sum : "$total" }}}
             ])
    .allowDiskUse(true)
    .exec(cb)
};
var target_achieved_current_Date = function(date, cb) {
  VideoViewModel
    .aggregate([{$match : {date : date,hour:{$exists:true}}},
                {$project:{total:"$total.totalView"} },
                {$group:{ _id :"",total : { $sum : "$total" }}}
             ])
    .allowDiskUse(true)
    .exec(cb)
};
var dayOfWeekAverageDataOfLastFive = function(date, cb) {
  var dayOfWeek = moment(new Date(date)).weekday()
  VideoViewModel
    .find({dayOfWeek:dayOfWeek,hour:{$exists:false},date:{$ne:date}})
    .sort({date:-1})
    .limit(5)
    .exec(function(err,doc){
      debugger;
      if (err) { 
        console.error(err) 
        cb(err,{totalAverage:0,cAverage:0,sAverage:0,mAverage:0})
      }else{
        var totalAverage = 0;
        var cAverage = 0;
        var sAverage = 0;
        var mAverage = 0; 
        debugger;
        for (var i = 0; i < doc.length; i++) {
          totalAverage = totalAverage + doc[i]['total']['totalView'];
          cAverage = cAverage + doc[i]['campaign']['totalView'];
          sAverage = sAverage + doc[i]['stream']['totalView'];
          mAverage = mAverage + doc[i]['myMedia']['totalView'];
          aAverage = aAverage + doc[i]['ads']['totalView'];

        }
        var totalAverage = Math.round(totalAverage / doc.length)
        var cAverage = Math.round(cAverage / doc.length)
        var sAverage = Math.round(sAverage / doc.length)
        var mAverage = Math.round(mAverage / doc.length)
        var aAverage = Math.round(aAverage / doc.length)

        cb(err,{totalAverage:totalAverage,cAverage:cAverage,sAverage:sAverage,mAverage:mAverage,aAverage:aAverage})
      }
    })
};
var send_SMS_To_Multiple_Number = function(doc,text,type,cb) {
  debugger;
  var length = doc.length,i=0, result = [];
  var text = text;
  function saveAll(){
    var number = doc[i];
    MS.sendSMS(number,text,function(e,d){
      i++;
      var data = {type:type,source:'abc',to:number,text:text};
      var newSMS = new SMS(data)
      newSMS.save(function(err, sms) {
        if (err) { console.error(err) }
        result.push(sms);
        if (i < length) {
          saveAll()
        }else{
          cb(null,result)
        }
      });
    })
  }
  saveAll();  
};
exports.send_SMS_To_Multiple_Number = send_SMS_To_Multiple_Number;

// exports.send_SMS_To_Multiple_Number_ckh = function(req, res) {
//  send_SMS_To_Multiple_Number(['8010795112','8826177920'],'as','Daily Video View Alert',function(err,doc){
//     res.send(err,doc)
//   })
// };
// Get list of smss
var send_sms_video_view_daily = function(doc, cb) {
  var firstLastDate = doc.firstLastDate;
  var secondLastDate = doc.secondLastDate;
  target_achieved_on_this_Month(firstLastDate.substring(0,7),function(err,doc){
    if (err) {
      cb(err,doc);
    }else{
      var target_TillDate = 0;
      if (doc.length > 0) {
        target_TillDate = doc[0].total;
      }
      debugger;
      dayOfWeekAverageDataOfLastFive(firstLastDate,function(err,doc){
      debugger;
        if (err) {
          console.log(err);
          cb(err,doc);
        }else{
          var lastFiveDaysWeekAverageData = doc;
          
          VideoViewModel.find({date : { $in: [firstLastDate,secondLastDate] },hour:{$exists:false}},function(err,doc){
            if (err) {
              cb(err,doc)
            }else{
              try{
                var firstLastDateData;
                var secondLastDateData;
                for (var i = 0; i < doc.length; i++) {
                  if (doc[i].date == firstLastDate) {
                    firstLastDateData = doc[i];
                  }
                  if (doc[i].date == secondLastDate) {
                    secondLastDateData = doc[i];
                  }
                }
                debugger
                if (!firstLastDateData && !secondLastDateData ) {
                  cb('Data corresponding to date '+firstLastDate+','+ secondLastDate + ' is not available',doc)  
                }else if (!secondLastDateData) { 
                  cb('Data corresponding to date ' + secondLastDate + ' is not available',doc) 
                }else if (!firstLastDateData  ) { 
                  cb('Data corresponding to date ' + firstLastDate + ' is not available',doc) 
                }else{
                  debugger
                  last_Five_Week_Avg_Vs_with_Current_Week_Avg_Date(firstLastDate,function(eW,dW){
                    if (eW) {
                      cb(eW,dW)
                    }else{
                      var text = genrate_SMS_Day_Wise(secondLastDateData,firstLastDateData,target_TillDate,lastFiveDaysWeekAverageData,dW)
                      debugger
                      if (text) {
                        send_SMS_To_Multiple_Number(Mobile_Numbers,text,'Daily Video View Alert',function(err,doc){
                          cb(err,doc)
                        })
                      }else{
                        cb('Empty text msg',null)
                      } 
                    }
                  })
                }
              }
              catch(err){
                cb(err,null)
              }
            }
          })
        }
      })
    }
  })
};
exports.send_sms_video_view_daily = send_sms_video_view_daily;
// exports.send_sms_video_view_daily = function(doc, cb) {
//   var firstLastDateData = doc;
//   var d = new Date(doc.date);
//   d.setDate(d.getDate()-1);
//   var secondLastDate = moment(d).format('YYYY-MM-DD').toString();
//   target_achieved_on_this_Month(secondLastDate.substring(0,7),function(err,doc){
//     if (err) {
//       cb(err,doc);
//     }else{
//       var targetDayWise = 0;
//       if (doc.length > 0) {
//         targetDayWise = doc[0].total;
//       }
//       VideoViewModel.findOne({date:secondLastDate,hour:{$exists:false}},function(err,doc){
//         // genrate SMS
//         var text = genrate_SMS_Day_Wise(doc,firstLastDateData,targetDayWise)
//         debugger
//         send_SMS_To_Multiple_Number(Mobile_Numbers,text,function(err,doc){
//           cb(err,doc)
//         })
//       })
//     }
//   })
// };

exports.send_sms_video_view_hourly = function(doc, cb) {
  var currentDate = doc.currentDate;
  var firstLastDate = doc.firstLastDate;
  var hour = doc.hour;
  debugger;

  target_achieved_on_this_Month(firstLastDate.substring(0,7),function(err,doc){
    if (err) {
      cb(err,doc);
    }else{
      var target_TillDate = 0;
      if (doc.length > 0) {
        target_TillDate = doc[0].total;
      }
      VideoViewModel.find({date : { $in: [currentDate,firstLastDate] },hour:hour},function(err,doc){
        if (err) {
          cb(err,doc)
        }else{
          try{
            var currentDateData="";
            var firstLastDateData="";
            for (var i = 0; i < doc.length; i++) {
              if (doc[i].date == currentDate) {
                currentDateData = doc[i];
              }
              if (doc[i].date == firstLastDate) {
                firstLastDateData = doc[i];
              }
            }
            debugger
            if (!currentDateData && !firstLastDateData ) { 
              cb('Data corresponding to date & hour '+currentDate+','+ firstLastDate + ',' + hour + ' is not available',null)  
            }else if (!firstLastDateData) { 
              cb('Data corresponding to date & hour' + firstLastDate + ',' + hour + ' is not available',null) 
            }else if (!currentDateData) { 
              cb('Data corresponding to date & hour ' + currentDate + ',' + hour + ' is not available',null) 
            }else{
              debugger
              target_achieved_current_Date(currentDate,function(err,currentDateTargetDoc){
                if (err) {
                  cb(err,currentDateTargetDoc)
                }else{
                  var currentDateTarget = 0;
                  if (currentDateTargetDoc.length > 0) {
                    currentDateTarget = currentDateTargetDoc[0].total;
                  }
                  // genrate SMS
                  var text = genrate_SMS_Hour_Wise(firstLastDateData,currentDateData,target_TillDate,currentDateTarget)
                  if (text) {
                    send_SMS_To_Multiple_Number(Mobile_Numbers,text,'Hourly Video View Alert',function(err,doc){
                      cb(err,doc)
                    })
                  }else{
                    cb('Empty text msg',null)
                  }
                }
              })
                    
            }
          }
          catch(err){
            cb(err,null)
          }
            
        }
      })
    }
  })
};


// Get list of smss
exports.index = function(req, res) {
  sms.find(function (err, smss) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(smss);
  });
};

// Get a single SMS
exports.show = function(req, res) {
  SMS.findById(req.params.id, function (err, sms) {
    if(err) { return handleError(res, err); }
    if(!sms) { return res.status(404).send('Not Found'); }
    return res.json(sms);
  });
};

// Creates a new sms in the DB.
exports.create = function(req, res) {
  SMS.create(req.body, function(err, sms) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(sms);
  });
};

// Updates an existing sms in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  SMS.findById(req.params.id, function (err, sms) {
    if (err) { return handleError(res, err); }
    if(!sms) { return res.status(404).send('Not Found'); }
    var updated = _.merge(sms, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(sms);
    });
  });
};

// Deletes a sms from the DB.
exports.destroy = function(req, res) {
  SMS.findById(req.params.id, function (err, sms) {
    if(err) { return handleError(res, err); }
    if(!sms) { return res.status(404).send('Not Found'); }
    sms.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}