'use strict';

angular.module('colorAdminApp')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {
    // stream routes start
    $stateProvider
        .state('app.json', {
            url: '/json',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.json.view', {
            url: '/view',
            templateUrl: 'app/json/views/viewLogs.html',
            data: { pageTitle: 'View' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.addjson', {
            url: '/addjson',
            templateUrl: 'app/json/views/jsonAdd.html',
            data: { pageTitle: 'Add Json' }
        })
        .state('app.json.editjson', {
            url: '/editjson?id',
            templateUrl: 'app/json/views/jsonEdit.html',
            data: { pageTitle: 'Edit Json' }
        })
        .state('app.json.ads', {
            url: '/ad',
            templateUrl: 'app/json/ads/adsLogs.html',
            data: { pageTitle: 'ads' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newads', {
            url: '/newads',
            templateUrl: 'app/json/ads/adsNew.html',
            data: { pageTitle: 'New Ads' }
        })
        .state('app.json.editads', {
            url: '/editads?id',
            templateUrl: 'app/json/ads/adsEdit.html',
            data: { pageTitle: 'Edit Ads' }
        })
        .state('app.json.fnb', {
            url: '/fnbs',
            templateUrl: 'app/json/fnb/fnbLogs.html',
            data: { pageTitle: 'FnB' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newfnb', {
            url: '/newfnb',
            templateUrl: 'app/json/fnb/fnbNew.html',
            data: { pageTitle: 'New fnb' }
        })
        .state('app.json.editfnb', {
            url: '/editfnb?id',
            templateUrl: 'app/json/fnb/fnbEdit.html',
            data: { pageTitle: 'Edit fnb' }
        })
        .state('app.json.games', {
            url: '/game',
            templateUrl: 'app/json/games/gamesLogs.html',
            data: { pageTitle: 'Games' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newgames', {
            url: '/newgames',
            templateUrl: 'app/json/games/gamesNew.html',
            data: { pageTitle: 'New Games' }
        })
        .state('app.json.editgames', {
            url: '/editgames?id',
            templateUrl: 'app/json/games/gamesEdit.html',
            data: { pageTitle: 'Edit Games' }
        })
        .state('app.json.travels', {
            url: '/travel',
            templateUrl: 'app/json/travels/travelsLogs.html',
            data: { pageTitle: 'Travels' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newtravels', {
            url: '/newtravels',
            templateUrl: 'app/json/travels/travelsNew.html',
            data: { pageTitle: 'New Travels' }
        })
        .state('app.json.edittravels', {
            url: '/edittravels?id',
            templateUrl: 'app/json/travels/travelsEdit.html',
            data: { pageTitle: 'Edit Travels' }
        })
        .state('app.json.reads', {
            url: '/reads',
            templateUrl: 'app/json/read/readLogs.html',
            data: { pageTitle: 'Read' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newread', {
            url: '/newread',
            templateUrl: 'app/json/read/readNew.html',
            data: { pageTitle: 'New Read' }
        })
        .state('app.json.editread', {
            url: '/editread?id',
            templateUrl: 'app/json/read/readEdit.html',
            data: { pageTitle: 'Edit Read' }
        })
        .state('app.json.malls', {
            url: '/malls',
            templateUrl: 'app/json/mall/mallLogs.html',
            data: { pageTitle: 'Mall' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        serie: true,
                        files: [
                            'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
                            'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
                            'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
                            'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
                            'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        ]   
                    });
                }]
            }
        })
        .state('app.json.newmall', {
            url: '/newmall',
            templateUrl: 'app/json/mall/mallNew.html',
            data: { pageTitle: 'New MALL' }
        })
        .state('app.json.editmall', {
            url: '/editmall?id',
            templateUrl: 'app/json/mall/mallEdit.html',
            data: { pageTitle: 'Edit Mall' }
        })
        .state('complete', {
            url: '/complete',
            templateUrl: 'app/json/views/success.html'

        })
        .state('fail', {
            url: '/fail',
            templateUrl: 'app/json/views/error.html'

        })
        // model routes end
  }]);
