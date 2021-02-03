
var ES = require('./email-settings');
var config = require('./environment');
var nodemailer = require("nodemailer");

var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host: ES.host,
	user: ES.user,
	password: ES.password,
	port: 25,
	ssl: false

});



var Mailgen = require('mailgen');

// Configure mailgen by setting a theme and your product info 
var mailGenerator = new Mailgen({
	theme: 'default',
	product: {
		// Appears in header & footer of e-mails 
		name: 'Vuliv',
		link: 'http://www.vuliv.com/',
		// Optional product logo 
		// logo: 'http://vuliv.com/wp-content/uploads/2016/08/Logo-Dark-20160727.png' 
	}
});


// Optionally, preview the generated HTML e-mail by writing it to a local file 
// require('fs').writeFileSync('preview.html', emailBody, 'utf8');





// Gmail
var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "gmail",
   host: 'smtp.gmail.com',
   auth: {
       user: "no-reply@mobisign.co.in",
       pass: "mojo@#12345"
   }
});

// Zimbra
// var smtpTransport = nodemailer.createTransport("SMTP", {
// 	host: "mail.vuliv.com",
// 	service: "Zimbra",
// 	port: 587,
// 	secure: true,
// 	auth: {
// 		user: "no-reply@mobisign.co.in",
// 		pass: "vuliv@2020"
// 	}
// });


// var async = require('async');


// var EmailTemplate = require('email-templates').EmailTemplate
// var path = require('path')

// var templateDir = path.join(__dirname,'templates')

// var user = {name: 'Joe', pasta: 'spaghetti'}
// newsletter.render(user, function (err, result) {
//   // result.html
//   // result.text
// })




// this is for banner reports
EM.dispatchEmail = function (account, subject, html, type, callback) {
	// Generate the plaintext version of the e-mail (for clients that do not support HTML) 
	// var emailText = mailGenerator.generatePlaintext(email);
	if (type == "timeSpent") {
		smtpTransport.sendMail({
			from: "no-reply@mobisign.co.in", // sender address
			to: account, // comma separated list of receivers
			subject: subject, // Subject line
			// text : "Please find the below details.",
			html: html // plaintext body,
		}, function (error, response) {
			if (error) {
				callback(error);
			} else {
				callback("Message sent: " + response.message);
			}
		});
	} 
	else if (type == "count") {
		let mailBody = {
			from: "no-reply@mobisign.co.in", // sender address
			to: account, // comma separated list of receivers
			subject: subject, // Subject line
			// text : "Please find the below details.",
			attachments: [
				{
					filename: 'HostWiseUser.csv',
					filePath: config.root + '/server/api/vuscreen/HostWiseUser.csv'
				},
				{
					filename: 'HostWiseClicks.csv',
					filePath: config.root + '/server/api/vuscreen/HostWiseClicks.csv'
				}
			],
			html: html // plaintext body,
		};
		smtpTransport.sendMail(mailBody, function (error, response) {
			if (error) {
				callback(error);
			} else {
				callback("Message sent: " + response.message);
			}
		});
	} 
	else if (type == "MTD") {
		let mailBody = {
			from: "no-reply@mobisign.co.in", // sender address
			to: account, // comma separated list of receivers
			subject: subject, // Subject line
			// text : "Please find the below details.",
			html: html // plaintext body,
		}
		smtpTransport.sendMail(mailBody, function (error, response) {
			if (error) {
				callback(error);
			} else {
				callback("Message sent: " + response.message);
			}
		});
	}
	 else if (type == "serversession") {
		let mailBody = {
			from: "no-reply@mobisign.co.in", // sender address
			to: account, // comma separated list of receivers
			subject: subject, // Subject line
			// text : "Please find the below details.",
			html: html // plaintext body,
		}
		smtpTransport.sendMail(mailBody, function (error, response) {
			if (error) {
				callback(error);
			} else {
				callback("Message sent: " + response.message);
			}
		});
	
	
	}
	else if (type == "wifisync") {
		let mailBody = {
			from: "no-reply@mobisign.co.in", // sender address
			to: account, // comma separated list of receivers
			subject: subject, // Subject line
			// text : "Please find the below details.",
			attachments: [
				{
					filename: 'wifilogin.csv',
					filePath: config.root + '/server/api/vuscreen/wifiloginsync.csv'
				}
			],
			html: html // plaintext body,
		};
		smtpTransport.sendMail(mailBody, function (error, response) {
			if (error) {
				callback(error);
			} else {
				callback("Message sent: " + response.message);
			}
		});
} 
else if (type == "wifiview") {
	let mailBody = {
		from: "no-reply@mobisign.co.in", // sender address
		to: account, // comma separated list of receivers
		subject: subject, // Subject line
		// text : "Please find the below details.",
		attachments: [
			{
				filename: 'wifilogin.csv',
				filePath: config.root + '/server/api/vuscreen/wifiloginview.csv'
			}
		],
		html: html // plaintext body,
	};
	smtpTransport.sendMail(mailBody, function (error, response) {
		if (error) {
			callback(error);
		} else {
			callback("Message sent: " + response.message);
		}
	});
} 
else {
	smtpTransport.sendMail({
		from: "no-reply@mobisign.co.in", // sender address
		to: account, // comma separated list of receivers
		subject: subject, // Subject line
		// text : "Please find the below details.",
		html: html // plaintext body,
	}, function (error, response) {
		if (error) {
			callback(error);
		} else {
			callback("Message sent: " + response.message);
		}
	});
}

}



EM.composeEmail = function (o) {
	var link = 'http://node-login.braitsch.io/reset-password?e=' + o.email + '&p=' + o.pass;
	var html = "<html><body>";
	html += "Hi " + o.name + ",<br><br>";
	html += "Your username is :: <b>" + o.user + "</b><br><br>";
	html += "<a href='" + link + "'>Please click here to reset your password</a><br><br>";
	html += "Cheers,<br>";
	html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
	html += "</body></html>";
	return [{ data: html, alternative: true }];
}