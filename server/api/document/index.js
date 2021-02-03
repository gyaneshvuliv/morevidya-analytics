'use strict';

var express = require('express');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
// var MS = require('../../helpers').sendSMS;
// var SMS = require('./sms.model');


var router = express.Router();

router.get('/', auth.isAuthenticated(), function(req,res) {
    
    //var doc_Vistara_Shuttle = [{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkS2EtT1d2RDc4Szg/view?usp=sharing'}];
    var doc_Vistara_airvistara = [{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkS2EtT1d2RDc4Szg/view?usp=sharing'}];
    var doc_Vistara_Shuttle  = [
                                {title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkS2EtT1d2RDc4Szg/view?usp=sharing'},
                                {title:'VuScreen Content Categories',link:'https://drive.google.com/file/d/0B3rHYMKZWeYsNzNhcnFfNGpYZ1U/view'},
                                {title:'Device Loan Agreement',link:'https://drive.google.com/file/d/0ByTL0aehLglkM1JQdzFxQ0E3R0E/view?usp=sharing'}
                            ];
    var doc_UBER = [
                    {title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkUHBQaWp3bzhFUkE/view?usp=sharing'},
                    {title:'Business Model',link:'https://drive.google.com/file/d/0ByTL0aehLglkaVhOXzdqbmVsMFk/view?usp=sharing'}
                    ];
    var doc_OLA = [{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkVjhickd5WGhZMDA/view?usp=sharing'}];
    var doc = [{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkUHBQaWp3bzhFUkE/view?usp=sharing'},
    			{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkS2EtT1d2RDc4Szg/view?usp=sharing'},
    			{title:'Product Overview',link:'https://drive.google.com/file/d/0ByTL0aehLglkVjhickd5WGhZMDA/view?usp=sharing'},
                {title:'Business Model',link:'https://drive.google.com/file/d/0ByTL0aehLglkaVhOXzdqbmVsMFk/view?usp=sharing'}];

    if (req.user.email.toString().indexOf('ola.com')>=0) {
    	res.send({data:doc_OLA})
    }else if(req.user.email.toString().indexOf('uber.com')>=0){
    	res.send({data:doc_UBER})
    }else if(req.user.email.toString().indexOf('shuttl.com')>=0){
    	res.send({data:doc_Vistara_Shuttle})
    }else if(req.user.email.toString().indexOf('airvistara.com')>=0
        || req.user.email.toString().indexOf('vuclip.com')>=0){
        res.send({data:doc_Vistara_airvistara})
    }else if(req.user.email.toString().indexOf('vuliv.com')>=0){
    	res.send({data:doc})
    }else{
        res.send({data:[]})
    }

});

router.get('/apk', auth.isAuthenticated(), function(req,res) {
    var doc_Vistara_Shuttle = [];
    var doc_OLA = [];
    var doc_UBER = [
                    {title:'VuScreen For Business',link:'https://drive.google.com/file/d/0ByTL0aehLglkbWYzYWR4NFhFbEk/view?usp=sharing'},
                    {title:'VuScreen For User',link:'https://drive.google.com/file/d/0ByTL0aehLglkTDdDOGx5RTN1NFU/view?usp=sharing'}
                    ];
    var doc = [
                    {title:'VuScreen For Business',link:'https://drive.google.com/file/d/0ByTL0aehLglkbWYzYWR4NFhFbEk/view?usp=sharing'},
                    {title:'VuScreen For User',link:'https://drive.google.com/file/d/0ByTL0aehLglkTDdDOGx5RTN1NFU/view?usp=sharing'}
                    ];


    if (req.user.email.toString().indexOf('ola.com')>=0) {
        res.send({data:doc_OLA})
    }else if(req.user.email.toString().indexOf('uber.com')>=0){
        res.send({data:doc_UBER})
    }else if(req.user.email.toString().indexOf('shuttl.com')>=0 
        || req.user.email.toString().indexOf('airvistara.com')>=0
        || req.user.email.toString().indexOf('vuclip.com')>=0
	){
        res.send({data:doc_Vistara_Shuttle})
    }else if(req.user.email.toString().indexOf('vuliv.com')>=0){
        res.send({data:doc})
    }

});


router.get('/screen', auth.isAuthenticated(), function(req,res) {
    var doc_Vistara_Shuttle = [{ type:'Comman',data : [{title:'Tour1',link:'/assets/images/screens/Shuttl_1.png'},
        {title:'Tour2',link:'/assets/images/screens/Shuttl_2.png'},
        {title:'Tour3',link:'/assets/images/screens/Shuttl_3.png'},
        {title:'Select Seat',link:'/assets/images/screens/Shuttl_4.png'},
        {title:'Home Screen',link:'/assets/images/screens/Shuttl_5.png'}]}];
    var doc_OLA = [{ type:'',data : [{title:'Tour1',link:'/assets/images/screens/Shuttl_1.png'},
        {title:'Tour2',link:'/assets/images/screens/Shuttl_2.png'},
        {title:'Tour3',link:'/assets/images/screens/Shuttl_3.png'},
        {title:'Select Seat',link:'/assets/images/screens/Shuttl_4.png'},
        {title:'Home Screen',link:'/assets/images/screens/Shuttl_5.png'}]}];
    var doc_UBER = [{
        type:'Driver',data : [{title:'Server_Start',link:'/assets/images/uber/driver/Server_Start.png'},
        {title:'Server_Info',link:'/assets/images/uber/driver/Server_Info.png'},
        {title:'Server-Timer',link:'/assets/images/uber/driver/Server-Timer_Stop.png'}]},
        {
        type:'Rider',data : [{title:'Tour1',link:'/assets/images/uber/rider/VuScreen_Tour1.jpg'},
        {title:'Tour2',link:'/assets/images/uber/rider/VuScreen_Tour2.jpg'},
        {title:'Tour3',link:'/assets/images/uber/rider/VuScreen_Tour3.jpg'},
        {title:'Select Hotspot',link:'/assets/images/uber/rider/VuScreen_Select_Hotspot.png'},
        {title:'Webpage Screen',link:'/assets/images/uber/rider/VuScreen_Webpage_Screen.png'}]}
        ];
    var doc = [{ type:'Comman',data : [{title:'Tour1',link:'/assets/images/screens/Shuttl_1.png'},
        {title:'Tour2',link:'/assets/images/screens/Shuttl_2.png'},
        {title:'Tour3',link:'/assets/images/screens/Shuttl_3.png'},
        {title:'Select Seat',link:'/assets/images/screens/Shuttl_4.png'},
        {title:'Home Screen',link:'/assets/images/screens/Shuttl_5.png'}]},{
        type:'Driver',data : [{title:'Server_Start',link:'/assets/images/uber/driver/Server_Start.png'},
        {title:'Server_Info',link:'/assets/images/uber/driver/Server_Info.png'},
        {title:'Server-Timer',link:'/assets/images/uber/driver/Server-Timer_Stop.png'}]},
        {
        type:'Rider',data : [{title:'Tour1',link:'/assets/images/uber/rider/VuScreen_Tour1.jpg'},
        {title:'Tour2',link:'/assets/images/uber/rider/VuScreen_Tour2.jpg'},
        {title:'Tour3',link:'/assets/images/uber/rider/VuScreen_Tour3.jpg'},
        {title:'Select Hotspot',link:'/assets/images/uber/rider/VuScreen_Select_Hotspot.png'},
        {title:'Webpage Screen',link:'/assets/images/uber/rider/VuScreen_Webpage_Screen.png'}]},
 { type:'Join',data : [{title:'Home Screen',link:'/assets/images/viu/join/home screen.png'},
        {title:'Join',link:'/assets/images/viu/join/join.png'},
        {title:'Searching Friends',link:'/assets/images/viu/join/searching friend.png'},
        {title:'Friend Listing',link:'/assets/images/viu/join/friend listing.png'},
        {title:'Screen Cast',link:'/assets/images/viu/join/screen cast.png'}]},

        { type:'Share',data : [{title:'Home screen',link:'/assets/images/viu/share/1_VIU Home screen.png'},
        {title:'Downloading Content',link:'/assets/images/viu/share/2_downloading content.png'},
        {title:'Download Completed',link:'/assets/images/viu/share/3_download completed.png'},
        {title:'Downloaded Files',link:'/assets/images/viu/share/4_downloaded files.png'},
        {title:'Invite',link:'/assets/images/viu/share/5_invite.png'},
        {title:'Invite_Popup',link:'/assets/images/viu/share/6_invite_popup.png'},
        {title:'App Joiner',link:'/assets/images/viu/share/7_download VIU app_joiner.png'},
        {title:'Searching Friends',link:'/assets/images/viu/share/8_searching friends.png'},
        {title:'Cast Screen',link:'/assets/images/viu/share/9_cast screen.png'}]}

        ];


var doc_viu = [

        { type:'Join',data : [{title:'Home Screen',link:'/assets/images/viu/join/home screen.png'},
        {title:'Join',link:'/assets/images/viu/join/join.png'},
        {title:'Searching Friends',link:'/assets/images/viu/join/searching friend.png'},
        {title:'Friend Listing',link:'/assets/images/viu/join/friend listing.png'},
        {title:'Screen Cast',link:'/assets/images/viu/join/screen cast.png'}]},

        { type:'Share',data : [{title:'Home screen',link:'/assets/images/viu/share/1_VIU Home screen.png'},
        {title:'Downloading Content',link:'/assets/images/viu/share/2_downloading content.png'},
        {title:'Download Completed',link:'/assets/images/viu/share/3_download completed.png'},
        {title:'Downloaded Files',link:'/assets/images/viu/share/4_downloaded files.png'},
        {title:'Invite',link:'/assets/images/viu/share/5_invite.png'},
        {title:'Invite_Popup',link:'/assets/images/viu/share/6_invite_popup.png'},
        {title:'App Joiner',link:'/assets/images/viu/share/7_download VIU app_joiner.png'},
        {title:'Searching Friends',link:'/assets/images/viu/share/8_searching friends.png'},
        {title:'Cast Screen',link:'/assets/images/viu/share/9_cast screen.png'}]}

        ];


    if (req.user.email.toString().indexOf('ola.com')>=0) {
        res.send({data:doc_OLA})
    }else if(req.user.email.toString().indexOf('uber.com')>=0){
        res.send({data:doc_UBER})
    }else if(req.user.email.toString().indexOf('shuttl.com')>=0 || req.user.email.toString().indexOf('airvistara.com')>=0){
        res.send({data:doc_Vistara_Shuttle})
    }else if(req.user.email.toString().indexOf('vuliv.com')>=0){
        res.send({data:doc})
    }else if(req.user.email.toString().indexOf('vuclip.com')>=0){
        res.send({data:doc_viu})
    }else{
        res.send({data:[]})
    }

});

// router.post('/sendMsg', auth.isAuthenticated(), function(req,res) {
//     var mobileNumber = req.body.mobileNumber;
//     var text = ''

//     if (req.body.apkUser) {
//         text = 'VuScreen for user : '+
//     }
//     if (req.body.apkBusiness) {
//         text = text  + '\nVuScreen for business : '+
//     }
//     if (text) {
//         MS.sendSMS(number,text,function(e,d){
//           i++;
//           var data = {type:'Get Apk',source:'Value First',to:mobileNumber,text:text};
//           var newSMS = new SMS(data)
//           newSMS.save(function(err, sms) {
//             if (err) { 
//                 console.error(err) 
//             }else{
//                 res.send({data:doc})
//             }
//             result.push(sms);
//             if (i < length) {
//               saveAll()
//             }else{
//               cb(null,result)
//             }
//           });
//         })
//     }else{

//     }

// });
module.exports = router;
