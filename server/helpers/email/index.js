var ES = require('../../config/environment').email;
var nodemailer = require("nodemailer");

var email_dispatcher = nodemailer.createTransport("SMTP",{
   host : ES.host,
   service: "Zimbra",
   port: 587,
   secure: true,
   auth: {
       user: ES.user,
       pass: ES.password
   }
});
module.exports = email_dispatcher;

