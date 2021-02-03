/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
// var mongoose = require('mongoose');
var config = require('./config/environment');
var db = require('./config/mysql')
var db_vp = require('./config/mysql_vp')

// Connect to MySQL on start
db.connect(config.mysql, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(-1)
  }else{
    console.log('connect to MySQL.')
  }
});


// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }

// Connect to redis-server (cahcing server)
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
