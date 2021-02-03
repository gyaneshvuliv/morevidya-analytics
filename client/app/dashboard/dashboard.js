
'use strict';

angular.module('colorAdminApp')
  	.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {

    $stateProvider
        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/dashboard/dashboard.html',
            data: { pageTitle: 'Dashboard' },
            resolve: {
                service: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            'assets/plugins/jquery-jvectormap/jquery-jvectormap-1.2.2.css',
                            'assets/plugins/bootstrap-calendar/css/bootstrap_calendar.css',
                            'assets/plugins/gritter/css/jquery.gritter.css',
                            // 'assets/plugins/morris/morris.css',
                            // 'assets/plugins/morris/raphael.min.js',
                            // 'assets/plugins/morris/morris.js',
                            // 'assets/plugins/jquery-jvectormap/jquery-jvectormap-1.2.2.min.js',
                            // 'assets/plugins/jquery-jvectormap/jquery-jvectormap-world-merc-en.js',
                            'assets/plugins/bootstrap-calendar/js/bootstrap_calendar.min.js',
                            'assets/plugins/gritter/js/jquery.gritter.js',
                            'assets/plugins/isotope/isotope.css',
                            'assets/plugins/lightbox/css/lightbox.css',
                            'assets/plugins/isotope/jquery.isotope.min.js',
                            'assets/plugins/bootstrap-daterangepicker/moment.js',
                            'assets/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            'assets/plugins/highcharts/drilldown.js'
                        ] 
                    });
                }]
            }
        })
  }]);