'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SMSDetailsSchema = new Schema({
  type: { type: String,required: true },
  sendAt: { type: Date,required: true,default:Date.now },
  source: { type: String,required: true },
  to: { type: String,required: true },
  text: { type: String,required: true }
},
  { 
    timestamps:true,
    collection : 'SMSDetails'
});
module.exports = mongoose.model('SMSDetails', SMSDetailsSchema);