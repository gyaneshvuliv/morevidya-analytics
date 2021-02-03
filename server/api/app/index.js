'use strict';

var express = require('express');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', function(req,res) {
	res.render('app');
});
router.get('/account/login', function(req,res) {
	res.render('account/login/login.jade');
});
router.get('/header',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.render('header',{user:user});
});
router.get('/sidebar',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.render('sidebar',{user:user});
});
router.get('/sidebar-right',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.render('sidebar-right',{user:user});
});
router.get('/top-menu',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.render('top-menu',{user:user});
});
router.get('/theme-panel',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.render('theme-panel',{user:user});
});
router.get('/session',auth.isAuthenticated(), function(req,res) {
	var user = {name:req.user.name,email:req.user.email};
	res.send({user:user});
});
// router.get('/dashboard',function(req,res) {
// 	res.render('dashboard/dashboard');
// });
module.exports = router;
