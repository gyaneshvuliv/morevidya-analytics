'use strict';

var express = require('express');
var controller = require('./json.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');

//get json logs
router.get('/', auth.isAuthenticated(), controller.vuscreen_json_index);
// router.get('/registration/export/csv', auth.isAuthenticated(), controller.vuscreen_registration_export_csv);
// get json details by id
router.get('/get-json-details/:id', auth.isAuthenticated(), controller.get_json_detaills)
// add json details
router.post('/add-json', controller.add_json)
// edit json details
router.post('/edit-json', auth.isAuthenticated(), controller.edit_json)
// change status
router.post('/change-status', auth.isAuthenticated(), controller.change_status)

// get folder list
router.get('/folder-list', auth.isAuthenticated(), controller.folder_list)
// get category list
router.get('/category-list', auth.isAuthenticated(), controller.category_list)
// get genre list
router.get('/genre-list', auth.isAuthenticated(), controller.genre_list)

//ads
router.get('/ads', auth.isAuthenticated(), controller.vuscreen_ads_index);
// get ads details by id
router.get('/get-ads-details/:id', auth.isAuthenticated(), controller.get_ads_detaills)
// add json details
router.post('/new-ads', controller.new_ads)
// edit ad details
router.post('/edit-ads', auth.isAuthenticated(), controller.edit_ads)
// change ad status
router.post('/change-ads-status', auth.isAuthenticated(), controller.change_ads_status)

// get ads type list
router.get('/type-list', auth.isAuthenticated(), controller.type_list)
// get ads section list
router.get('/section-list', auth.isAuthenticated(), controller.section_list)

//games logs
router.get('/games', auth.isAuthenticated(), controller.vuscreen_games_index);
// get store folder list
router.get('/store-folder-list', auth.isAuthenticated(), controller.store_folder_list)
// change games status
router.post('/change-games-status', auth.isAuthenticated(), controller.change_games_status)
// get games details by id
router.get('/get-games-details/:id', auth.isAuthenticated(), controller.get_games_detaills)
// edit games details
router.post('/edit-games', auth.isAuthenticated(), controller.edit_games)
// add games details
router.post('/add-games', controller.add_games)

//travels logs
router.get('/travels', auth.isAuthenticated(), controller.vuscreen_travels_index);
// get travel folder list
router.get('/travel-folder-list', auth.isAuthenticated(), controller.travel_folder_list)
// change travels status
router.post('/change-travels-status', auth.isAuthenticated(), controller.change_travels_status)
// get travels details by id
router.get('/get-travels-details/:id', auth.isAuthenticated(), controller.get_travels_detaills)
// edit travels details
router.post('/edit-travels', auth.isAuthenticated(), controller.edit_travels)
// add travels details
router.post('/add-travels', controller.add_travels)

//read logs
router.get('/read', auth.isAuthenticated(), controller.vuscreen_read_index);
// get read folder list
router.get('/read-folder-list', auth.isAuthenticated(), controller.read_folder_list)
// change read status
router.post('/change-read-status', auth.isAuthenticated(), controller.change_read_status)
// get read details by id
router.get('/get-read-details/:id', auth.isAuthenticated(), controller.get_read_detaills)
// edit read details
router.post('/edit-read', auth.isAuthenticated(), controller.edit_read)
// add read details
router.post('/add-read', controller.add_read)

//mall logs
router.get('/mall', auth.isAuthenticated(), controller.vuscreen_mall_index);
// get mall folder list
router.get('/mall-folder-list', auth.isAuthenticated(), controller.mall_folder_list)
// change mall status
router.post('/change-mall-status', auth.isAuthenticated(), controller.change_mall_status)
// get mall details by id
router.get('/get-mall-details/:id', auth.isAuthenticated(), controller.get_mall_detaills)
// edit mall details
router.post('/edit-mall', auth.isAuthenticated(), controller.edit_mall)
// add mall details
router.post('/add-mall', controller.add_mall)

//fnb logs
router.get('/fnb', auth.isAuthenticated(), controller.vuscreen_fnb_index);
// get fnb folder list
router.get('/fnb-folder-list', auth.isAuthenticated(), controller.fnb_folder_list)
// change fnb status
router.post('/change-fnb-status', auth.isAuthenticated(), controller.change_fnb_status)
// get fnb details by id
router.get('/get-fnb-details/:id', auth.isAuthenticated(), controller.get_fnb_detaills)
// edit fnb details
router.post('/edit-fnb', auth.isAuthenticated(), controller.edit_fnb)
// add fnb details
router.post('/add-fnb', controller.add_fnb)

module.exports = router;
