var _ = require('lodash');
exports.email_dispatcher = require('./email');

exports.MergeTwoJsonArray = function (jsonArray1,key1,jsonArray2,key2) {
  var newArray = [];
  for (var i = 0; i < jsonArray1.length; i++) {
    var obj = jsonArray1[i]._doc;
    var isExists = false;
    for (var x = 0; x < jsonArray2.length; x++) {
      // debugger;
      if (obj[key1].toString() == jsonArray2[x]['_id'][key2].toString()) {
        for (key in jsonArray2[x]) {
          if (key != '_id') {
            obj[key] = jsonArray2[x][key];
          }
        }
        isExists = true;
        newArray.push(obj);
      }
    }
    if (isExists == false) {
      newArray.push(obj);
    }
  };
  return newArray;
}
exports.MergeTwoJsonArrayArray = function (jsonArray1,key1,jsonArray2,key2) {
  var newArray = [];
  for (var i = 0; i < jsonArray1.length; i++) {
    var obj = jsonArray1[i];
    var isExists = false;
    for (var x = 0; x < jsonArray2.length; x++) {
      // debugger;
      if (obj['_id'][key1].toString() == jsonArray2[x]['_id'][key2].toString()) {
        for (key in jsonArray2[x]) {
          obj[key] = jsonArray2[x][key];
        }
        isExists = true;
        newArray.push(obj);
      }
    }
    if (isExists == false) {
      newArray.push(obj);
    }
  };
  return newArray;
}
// exports.sendSMS = require('./SMS');