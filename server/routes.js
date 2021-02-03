/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/cron', require('./api/cron'));
  app.use('/api/tambola', require('./api/tambola'));
  app.use('/api/flight', require('./api/flight'));
  app.use('/api/brands', require('./api/brands'));
  app.use('/api/json', require('./api/json'));
  app.use('/api/vuscreen', require('./api/vuscreen'));
  app.use('/api/vuprime', require('./api/vuprime'));
  app.use('/api/map', require('./api/map'));
  app.use('/api/dashboard', require('./api/dashboard'));
  app.use('/api/documents', require('./api/document'));
  app.use('/api/session', require('./api/session'));
  app.use('/app', require('./api/app'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|bower_components|assets)/*')
   .get(errors[404]);
  
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
