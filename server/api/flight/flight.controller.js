'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var moment = require('moment');

// Get list of tracking logs
var tracking_Pagination = function (req, cb) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
  var filter = '';
  if (req.query.mobile_no) { filter = " AND mobile_no ='" + req.query.mobile_no + "'" }
  if (req.query.f_no) { filter = " AND f_no ='" + req.query.f_no + "'" }

  var query = "select "
    + " name,"
    + " mobile_no,"
    + " date,"
    + " base_station,"
    + " source,"
    + " destination,"
    + " f_no,"
    + " host1,"
    + " host2,"
    + " remote,"
    + " f_type,"
    + " air_craft_type,"
    + " ftime,"
    + " sync_datetime"
    + " from"
    + " vuscreen_ife_data where date>='" + startDate + "' AND date<='" + endDate + "'" + filter
    + " order by id desc"
  // console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })
};

// Get list of tracking logs
exports.tracking = function (req, res) {
  tracking_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

exports.tracking_Bottom = function (req, res) {
  var startDate = 'null', endDate = 'null';
  if (req.query.startDate) { startDate = moment(req.query.startDate).format('YYYY-MM-DD'); }
  if (req.query.endDate) { endDate = moment(req.query.endDate).format('YYYY-MM-DD'); }
 var query="select (SELECT count(1) FROM morevidya.vuscreen_ife_data   where f_type='Domestic' and  date<='"+endDate+"' and date>='"+startDate+"') domestic,"
 +"(SELECT count(1) FROM morevidya.vuscreen_ife_data   where f_type='International' and date<='"+endDate+"' and date>='"+startDate+"')International"
 db.get().query(query, function (err, doc) {
  if (err) { return handleError(res, err); }
  return res.status(200).json(doc);
})
};
//export csv function for  tracking logs
exports.tracking_export_csv = function (req, res) {
  var fields = ["name", "mobile_no", "date", "base_station", "source", "destination", "f_no", "host1", "host2", "remote", "f_type", "ftime","sync_datetime"];
  var fieldversions = ["name", "mobile_no", "date", "base_station", "source", "destination", "f_no", "host1", "host2", "remote", "f_type", "ftime","sync_datetime"];

  var name = 'flight_tracking' + (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fieldversions.join(","));

  function pagination() {
    tracking_Pagination(req, function (err, doc) {
      if (doc.data.length > 0) {
        req.query.start = parseInt(req.query.start) + parseInt(req.query.length);
        var row = '';
        for (var i = 0; i < doc.data.length; i++) {
          var json = doc.data[i];
          var col = '';
          for (var x = 0; x < fields.length; x++) {
            var val = json[fields[x]];
            if (val) {
              val = val.toString().replace(/,/g, ' ').replace(/"/g, ' ');
            }
            if (val == '' || typeof (val) == 'undefined' || val == null) { val = ' '; };
            if (col == '') {
              col = val;
            } else {
              col = col + ',' + val;
            }
          };
          if (row == '') { row = col; }
          else { row = row + '\r\n' + col; }
        };
        res.write('\r\n');
        res.write(row);
        pagination();
      } else {
        res.end();
      }
    })
  }
  pagination();
}

function handleError(res, err) {
  return res.status(500).send(err);
}