'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-query-paginate');
var ActionSchema = new Schema({
  uid: String,
  device_id: String,
  interface: String,
  version: String,
  cat: String,
  time: String,
  params: {type: Schema.Types.Mixed },
  region: String,
  sync_datetime : String,
  sync_date : String,
  view_datetime : String,
  view_date : String
},
  { 
    collection : "tbl_vu_screen_tracker" 
    // collection : "tbl_app_analytic_tracker" 

});

module.exports = mongoose.model('Action', ActionSchema);