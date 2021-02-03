'use strict';

angular.module('colorAdminApp')
  	.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {
  	// stream routes start
    $stateProvider
        // Campaign View start
        .state('app.maps', {
            url: '/maps',
            template: '<div ui-view></div>',
            abstract: true
        })
        .state('app.maps.view', {
            url: '/view',
            data: { pageTitle: 'View' },
            templateUrl: 'app/map/indiamap.html',
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
        .state('app.maps.staticview', {
            url: '/staticview',
            data: { pageTitle: 'Static View' },
            templateUrl: 'app/map/staticview.html',
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
        .state('app.maps.playmapview', {
            url: '/play-map-view',
            data: { pageTitle: 'Play-Map-View' },
            templateUrl: 'app/map/geography.html'
        })
        .state('app.maps.vpview', {
            url: '/vp-view',
            data: { pageTitle: 'View' },
            templateUrl: 'app/map/vpindiamap.html',
            // resolve: {
            //     service: ['$ocLazyLoad', function($ocLazyLoad) {
            //         return $ocLazyLoad.load({
            //             serie: true,
            //             files: [
            //                 'assets/plugins/DataTables/media/css/dataTables.bootstrap.min.css',
            //                 'assets/plugins/DataTables/extensions/Buttons/css/buttons.bootstrap.min.css',
            //                 'assets/plugins/DataTables/extensions/FixedHeader/css/fixedHeader.bootstrap.min.css',
            //                 'assets/plugins/DataTables/extensions/Responsive/css/responsive.bootstrap.min.css',
            //                 'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
            //                 'assets/plugins/DataTables/media/js/jquery.dataTables.min.js',
            //                 'assets/plugins/DataTables/media/js/dataTables.bootstrap.min.js',
            //                 'assets/plugins/DataTables/extensions/FixedHeader/js/dataTables.fixedHeader.min.js',
            //                 'assets/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/dataTables.buttons.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/buttons.bootstrap.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/buttons.print.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/buttons.flash.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/buttons.html5.min.js',
            //                 'assets/plugins/DataTables/extensions/Buttons/js/buttons.colVis.min.js',
            //                 'assets/plugins/bootstrap-daterangepicker/moment.js',
            //                 'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
            //             ]   
            //         });
            //     }]
            // }
        })
        .state('app.maps.vpplaymapview', {
            url: '/vp-play-map-view',
            data: { pageTitle: 'Play-Map-View' },
            templateUrl: 'app/map/vpgeography.html'
        })
        // Campaign routes end
  }]);