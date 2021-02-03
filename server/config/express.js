/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var moment = require('moment')
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();

module.exports = function(app) {
  var env = app.get('env');
  app.version = '0.0.1';
  var versionator = require('versionator').create(app.version);
  app.use(versionator.middleware)
  app.set('views', config.root + '/server/views/themes/'+config.theme);

  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  // app.use(multipartMiddleware);
  
  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,maxAge:60000 * 335 },
    // store: new mongoStore({
    //   mongooseConnection: mongoose.connection,
    //   db: 'TimeBombGCM'
    // })
  }));
  app.use(function(req, res, next) {
    try{
      if(req.url.toString().indexOf('/export/csv') > 0){
        req.query.length = 100000;
      }
      next();
    }catch(err){
      res.status(500).send(err)
    }
  });
  // app.use(function(req, res, next){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  //   var err = req.session.error                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  //     , msg = req.session.success;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  //   delete req.session.error;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  //   delete req.session.success;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  //   res.locals.message = '';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
  //   if (err) res.locals.message = '<p class="msg error">' + err + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  //   if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  //   next();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
  // }); 
  // var forceDomain = require('node-force-domain');
  // app.use(forceDomain({
  //   hostname: 'gcmreport.vuliv.com'
  // }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
  });


  app.use(function(req, res, next) {
    try{
      if (req.query.startDate) {
        var sdate = new Date(moment(new Date(req.query.startDate)).format('YYYY-MM-DD')+"T00:00:00.0Z").getTime() - 19800000
        req.query.startDate = new Date(sdate);
      }
      if (req.query.endDate) {
        var edate = new Date(moment(new Date(req.query.endDate)).format('YYYY-MM-DD')+"T23:59:59.0Z").getTime() - 19800000
        req.query.endDate = new Date(edate);
      }
      next();
    }catch(err){
      res.status(500).send(err)
    }
  });
  if ('production' === env) {
    app.set('trust proxy', 1) // trust first proxy
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', path.join(config.root, 'public'));
    app.use(morgan('combined'));
  }

  if ('development' === env || 'test' === env) {
    app.set('trust proxy', 1) // trust first proxy
    // app.use(require('connect-livereload')());
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    // app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client'), { maxAge: 0 }));
    // app.use(express.static(path.join(config.root, 'client'), { maxAge: 2592000000 }));
    app.set('appPath', path.join(config.root, 'client'));
    // app.use(morgan('dev'));
    app.use(morgan('combined'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};