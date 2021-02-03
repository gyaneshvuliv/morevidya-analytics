'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });
var db = require('../config/mysql')
/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      // console.log(req.headers.authorization);
      // changed by manoj kaushik 29-12-2016
      validateJwt(req, res,function(err){
        // console.log(err);
        if (err) { 
          if (req.url.toString().indexOf('/app') == 0 ) {
            return res.redirect('/login');
          }else{
            return res.status(401).send({message:err.code});
          }
        }else{
          next();
        }
      });
      // validateJwt(req, res,next);

    })
    // Attach user to request
    .use(function(req, res, next) {
      var query = "select * from account_management where id='"+ req.user.id + "'"
      db.get().query(query, function (err,user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');
        req.user = user[0];
        next();
      })
      // User.findById(req.user._id, function (err, user) {
      //   if (err) return next(err);
      //   if (!user) return res.status(401).send('Unauthorized');
      //   req.user = user;
      //   next();
      // });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).send('Forbidden');
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  /*  jsonwebtoken: expiresInMinutes and expiresInSeconds is deprecated.
    use expiresIn instead of expiresInMinutes method key
    Author : Manoj Kaushik
    Date : 08/06/2016
    Modified_by : Manoj Kaushik
    Modification Date : 08/06/2016
  */
  //return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  return jwt.sign({ id: id }, config.secrets.session, { expiresIn: 600*5 });
}
/**
 * Returns a jwt token signed by the app secret
 */
function signAdminToken(id) {
  /*  jsonwebtoken: expiresInMinutes and expiresInSeconds is deprecated.
    use expiresIn instead of expiresInMinutes method key
    Author : Manoj Kaushik
    Date : 08/06/2016
    Modified_by : Manoj Kaushik
    Modification Date : 08/06/2016
  */
  //return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
  return jwt.sign({ id: id }, config.secrets.session, { expiresIn: 600*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});

  debugger;
  var token = signToken(req.user.id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
exports.signAdminToken = signAdminToken;
