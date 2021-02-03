var SS = require('../../config/environment').sms;
var request = require('request');
// Get a single SMS
exports.sendSMS = function(to,text, cb) {
	var text = "Dear Recipient \n" + text;
	request({
            url: SS.uri, //URL to hit
            qs: {username:SS.username,password:SS.password,from:SS.from,to:to,text:text}, //Query string data
            method: 'GET', //Specify the method
            headers: { //We can define headers too
              'Content-Type': 'application/json; charset=utf-8'
            }
          }, function(error, response, body){
            if(error || response.statusCode != 200 ) {
              cb('error',{body:body});
            }else {
              cb(null,{body:body,message:'SMS has been sent successfully'});
            }
        })
};