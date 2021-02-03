'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var db = require('../../config/mysql')

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  var query = "select * from account_management "
  db.get().query(query, function (err,users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  })
  // User.find({}, '-salt -hashedPassword', function (err, users) {
  //   if(err) return res.status(500).send(err);
  //   console.log(users)
  //   res.status(200).json(users);
  // });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    /*  jsonwebtoken: expiresInMinutes and expiresInSeconds is deprecated.
      use expiresIn instead of expiresInMinutes method key
      Author : Manoj Kaushik
      Date : 08/06/2016
      Modified_by : Manoj Kaushik
      Modification Date : 08/06/2016
    */
    // var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60000*5 });
    // res.json({ token: token });
    res.status(200).send({message:'Account has been successfully genrated. Please check your email for account verification'});
  });
};

/**
 * Get a single user
 */
exports.email_confirmation = function (req, res, next) {

  User.findOne({email:req.query.email}, function (err, user) {
    debugger;
    if (err) return next(err);
    if (!user) return res.status(422).send('Email address is not registered');
    
    if (user.verification_token === req.query.verification_token  ) {
      user.verified = true;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.redirect('/login');
      });
    }else{
      return res.status(401).send('Unauthorized');
    }
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  var query = "select * from account_management where id = '"+ userId +"'"
  db.get().query(query, function (err,user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  })
  // User.findById(userId, function (err, user) {
  //   if (err) return next(err);
  //   if (!user) return res.status(401).send('Unauthorized');
  //   res.json(user.profile);
  // });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user.id;
  // User.findOne({
  //   _id: userId
  // }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
  //   if (err) return next(err);
  //   if (!user) return res.status(401).send('Unauthorized');
  //   res.json(user);
  // });
  var query = "select * from account_management where id='"+ userId + "'"
  db.get().query(query, function (err,user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user[0]);
  })
};

exports.get_role = function(req, res) {
    return res.status(200).json(req.user.role);
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
