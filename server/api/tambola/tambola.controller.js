'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')
var moment = require('moment');

// Get list of tambola logs
var tambola_Pagination = function (req, cb) {
  
  var filter = '';
  if (req.query.hostID) { filter = " Where hostID ='" + req.query.hostID + "'" }
  if (req.query.gameId) { filter = " Where gameId ='" + req.query.gameId + "'" }

  var query = "select "
    + " gameName,"
    + " hostID,"
    + " gameStartTime,"
    + " gameEndTime,"
    + " registerUser,"
    + " gameId,"
    + " eventId"
    + " from"
    + " tambola " + filter + " order by gameName"
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })
};

// Get list of tambola logs
exports.tambola = function (req, res) {
  tambola_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


//export csv function for  tambola logs
exports.tambola_export_csv = function (req, res) {
  var fields = ["gameName","hostID","gameStartTime","gameEndTime","registerUser","gameId","eventId"];
  var fieldversions = ["gameName","hostID","gameStartTime","gameEndTime","registerUser","gameId","eventId"];

  var name = 'tambola' + (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fieldversions.join(","));

  function pagination() {
    tambola_Pagination(req, function (err, doc) {
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

// Get list of tambola_players logs
var tambola_players_Pagination = function (req, cb) {
  
  var filter = '';
  if (req.query.name) { filter = " where name ='" + req.query.name + "'" }
  if (req.query.gameId) { filter = " where gameId ='" + req.query.gameId + "'" }

  var query = "select "
    + " playerId,"
    + " gameId,"
    + " name,"
    + " mobile,"
    + " seatNo,"
    + " macId,"
    + " score,"
    + " prizeId,"
    + " prizeName"
    + " from"
    + " tambola_players " + filter + " order by name"
    console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })
};

// Get list of tambola_players logs
exports.tambola_players = function (req, res) {
  tambola_players_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


//export csv function for  tambola_players logs
exports.tambola_players_export_csv = function (req, res) {
  var fields = ["playerId","gameId","name","mobile","seatNo","macId","score","prizeId","prizeName"];
  var fieldversions = ["playerId","gameId","name","mobile","seatNo","macId","score","prizeId","prizeName"];

  var name = 'tambola_players' + (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fieldversions.join(","));

  function pagination() {
    tambola_players_Pagination(req, function (err, doc) {
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

// Get list of tambola_winnerList logs
var tambola_winnerList_Pagination = function (req, cb) {
  
  var filter = '';
  if (req.query.name) { filter = " where name ='" + req.query.name + "'" }
  if (req.query.gameId) { filter = " where gameId ='" + req.query.gameId + "'" }

  var query = "select "
    + " winnerId,"
    + " gameId,"
    + " name,"
    + " mobile,"
    + " seatNo,"
    + " macId,"
    + " score,"
    + " prizeId,"
    + " prizeName"
    + " from"
    + " tambola_winnerList " +  filter + " order by name"
    console.log(query)
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })
};

// Get list of tambola_winnerList logs
exports.tambola_winnerList = function (req, res) {
  tambola_winnerList_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};


//export csv function for  tambola_winnerList logs
exports.tambola_winnerList_export_csv = function (req, res) {
  var fields = ["winnerId","gameId","name","mobile","seatNo","macId","score","prizeId","prizeName"];
  var fieldversions = ["winnerId","gameId","name","mobile","seatNo","macId","score","prizeId","prizeName"];

  var name = 'tambola_winnerList' + (moment(new Date()).format('YYYY-MM-DD')).toString()
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment;filename=' + name + '.csv');
  res.write(fieldversions.join(","));

  function pagination() {
    tambola_winnerList_Pagination(req, function (err, doc) {
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