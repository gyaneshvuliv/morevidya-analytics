'use strict';

angular.module('colorAdminApp')
  .config(function ($stateProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        // set the default header for all ajax call
        // author : manoj kaushik
        // dt : 2016-08-06 
        $.ajaxSetup({
                    headers: { 'Authorization': 'Bearer ' + $cookieStore.get('token') },
                    statusCode: {
                        200: function (data) {
                            // alert('200: Authenticated');
                            // Bind the JSON data to the UI
                        },
                        401: function (data) {
                          //alert('401: Unauthenticated, session has been expired');
                          // $location.path('/login');
                          window.location.href = '/login'
                            // Handle the 401 error here.
                        }
                    }
                });
        // end
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
          // author : manoj kaushik
          // dt : 2016-08-06
          config.headers['Accept'] = 'application/json;odata=verbose';
          // end
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401 || response.status === 403) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
    // Redirect to login if route requires auth and you're not logged in // for state Provider
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
