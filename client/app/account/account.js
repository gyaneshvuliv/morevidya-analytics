'use strict';

// angular.module('colorAdminApp')
//   .config(function ($routeProvider) {
//     $routeProvider
//       .when('/login', {
//         templateUrl: 'app/account/login/login.html',
//         controller: 'LoginCtrl'
//       })
//       .when('/signup', {
//         templateUrl: 'app/account/signup/signup.html',
//         controller: 'SignupCtrl'
//       })
//       .when('/settings', {
//         templateUrl: 'app/account/settings/settings.html',
//         controller: 'SettingsCtrl',
//         authenticate: true
//       });
//   });

'use strict';

angular.module('colorAdminApp')
  	.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $stateProvider
        // Login Page routes start
        .state('/login', {
            url: '/login',
            templateUrl: '/app/account/login',
            controller: 'LoginCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'app/account/settings/settings.html',
            controller: 'SettingsCtrl',
            // authenticate: true
        })
        // login routes end
        // signup
        .state('/register', {
            url: '/register',
            templateUrl: '/app/account/signup/signup.html',
            data: { pageTitle: 'Registeration' },
            controller: 'signupController'
        })
        // signup
  }]);