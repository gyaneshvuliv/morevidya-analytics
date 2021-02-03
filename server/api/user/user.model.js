'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var helper = require('../../helpers');
var EM = helper.email_dispatcher;
var Mailgen = require('mailgen');
var text = "don't be so smart",key = 'DAM DAM';

var UserSchema = new Schema({
  fname: { type: String, required: true},
  lname: { type: String, required: true},
  name: { type: String,required: true},
  logo: { type: String,required: false},
  email: { type: String, lowercase: true,required: true,unique: true },
  mobileNo: { type: String, lowercase: true,required: true },
  companyName: { type: String, lowercase: true,required: true },
  partner_id: { type: String, required: false},
  role: {
    type: String,
    default: 'user'
  },
  verification_token: { type: String,required: true,default:function(){
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var token = '';
    for (var i = 128; i > 0; --i) {
      token += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return token;
  }},
  verified: { type: Boolean,required: true,default:false},
  last_login_date: { type: Date,default: new Date()},
  hashedPassword: { type: String, required: true, },
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {}
},
{
  timestamps: true
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    // UserSchema.verification_token = crypto.createHmac('sha1', key).update(text).digest('hex')
    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Post-save hook
 */
UserSchema
  .post('save', function(doc) {
    // Email Template
    var mailGenerator = new Mailgen(
      {
        theme: 'default', // cerberus,neopolitan,salted
        product: {
          // Appears in header & footer of e-mails 
          name: 'Vuliv',
          link: 'http://www.vuliv.com/',
          // Optional product logo 
          logo: 'http://vuliv.com/wp-content/uploads/2016/08/Logo-Dark-20160727.png' 
        }
      }
    );
    // Prepare email contents
    var email = {
        body: {
            name: doc.name, // Name of singup User
            intro: 'Welcome to VuScreen ! We’re very excited to have you on board.',
            action: {
                instructions: 'To get started with VuScreen s, please click here:',
                button: {
                    color: 'green',
                    text: 'Confirm Your Account',
                    link: 'https://gcmreport.vuliv.com/api/users/email/confirmation?verification_token='+doc.verification_token+'&email='+doc.email
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    var subject = 'VuScreen Account Verification'
    // after account successfully verfication
    if (doc.verified) {
      subject = 'VuScreen Account is successfully verified'
      // Prepare email contents
      var email = {
          body: {
              name: doc.name, // Name of singup User
              intro: 'Welcome to VuScreen ! You have successfully verified you account. Welcome on board',
              outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
          }
      };
    }
    // Generate an HTML email with the provided contents 
    var emailBody = mailGenerator.generate(email);
    // EM.sendMail({
    //   from: "no-reply@vuliv.com", // sender address
    //   to: doc.email, // comma separated list of receivers
    //   subject: 'Vuliv Account Verification Email', // Subject line
    //   html: emailBody, // plaintext body
    // }, function(error, response){
    //   if(error){
    //     console.error(error)
    //   }else{
    //     console.info("Message has been succesfully sent to " + doc.email)
    //   }
    // });
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    debugger;
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
