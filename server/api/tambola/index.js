'use strict';

var express = require('express');
var controller = require('./tambola.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');


// tambola
router.get('/tambola', auth.isAuthenticated(), controller.tambola)
router.get('/tambola/export/csv', auth.isAuthenticated(), controller.tambola_export_csv);

// tambola players
router.get('/tambola-players', auth.isAuthenticated(), controller.tambola_players)
router.get('/tambola-players/export/csv', auth.isAuthenticated(), controller.tambola_players_export_csv);

// tambola winners
router.get('/tambola-winners', auth.isAuthenticated(), controller.tambola_winnerList)
router.get('/tambola-winners/export/csv', auth.isAuthenticated(), controller.tambola_winnerList_export_csv);


module.exports = router;
