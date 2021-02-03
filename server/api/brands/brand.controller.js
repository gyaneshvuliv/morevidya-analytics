'use strict';

var _ = require('lodash');
var db = require('../../config/mysql')

// Get list of Json data
var vuscreen_getAllAdsData_Pagination = function (req, cb) {
  var filter = '';
  // custom filters
  if (req.query.status) {
    filter = " where status ='" + req.query.status + "'"
  }
  // only search filters
  if (req.query.brand) { filter = " where brand ='" + req.query.brand + "'" }
  if (req.query.title) { filter = " where title ='" + req.query.title + "'" }
  if (req.query.id) { filter = " where id ='" + req.query.id + "'" }

  var query = "select "
    + " * "
    + " from"
    + " vuscreen_brand_content"
    + filter + " order by title asc"
  var option = { draw: req.query.draw, start: req.query.start, length: req.query.length };
  db.pagination(query, option, function (err, doc) {
    return cb(err, doc);
  })

};

// Get list of ads
exports.vuscreen_ads_index = function (req, res) {
  vuscreen_getAllAdsData_Pagination(req, function (err, doc) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(doc);
  })
};

// change status of ads in json
exports.change_ads_status = function (req, res) {
  var query = "Update "
    + " vuscreen_brand_content SET "
    + "    status = '" + req.body.status + "'"
    + " where "
    + " id='" + req.body.id + "'"

  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      insertAds(req.body.id)
      return res.status(200).json(doc);
    }

  })
}

function insertAds(id) {
  let query = "Select * From "
    + " vuscreen_brand_content "
    + " where "
    + " id='" + id + "'"
  db.get().query(query, function (err, doc) {
    if (err) { return handleError(res, err); }
    else {
      let video = "video-ad"
      let banner = "banner-ad"
      if (doc[0].pre != "undefined") {
        var query = "Insert INTO"
          + " vuscreen_advertise_content "
          + " (status, title, thumbnail, url, type, format, start_time,end_time, partner_id, brand)"
          + " VALUES ('0', '" + doc[0].title + "','" + doc[0].thumbnail + "','" + doc[0].url + "','" + video
          + "','" + doc[0].format + "','" + doc[0].start_time + "','" + doc[0].end_time + "','" + doc[0].partner_id + "','" + doc[0].brand + "')";
        db.get().query(query, function (err, doc) {
          if (err) { console.log(err); }
          else { console.log("success"); }
        })
      }
      if (doc[0].mid != "undefined") {
        var query = "Insert INTO"
          + " vuscreen_advertise_content "
          + " (status, title, thumbnail, url, type, format, start_time,end_time, partner_id, brand)"
          + " VALUES ('0', '" + doc[0].title + "','" + doc[0].thumbnail + "','" + doc[0].url + "','" + video
          + "','" + doc[0].format + "','" + doc[0].start_time + "','" + doc[0].end_time + "','" + doc[0].partner_id + "','" + doc[0].brand + "')";
        db.get().query(query, function (err, doc) {
          if (err) { console.log(err); }
          else { console.log("success"); }
        })
      }
      if (doc[0].banner != "undefined") {
        var query = "Insert INTO"
          + " vuscreen_advertise_content "
          + " (status, title, thumbnail, url, type, format, start_time,end_time, partner_id, brand)"
          + " VALUES ('0', '" + doc[0].title + "','" + doc[0].thumbnail + "','" + doc[0].url + "','" + banner
          + "','" + doc[0].format + "','" + doc[0].start_time + "','" + doc[0].end_time + "','" + doc[0].partner_id + "','" + doc[0].brand + "')";
        db.get().query(query, function (err, doc) {
          if (err) { console.log(err); }
          else { console.log("success"); }
        })
      }
    }
  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}