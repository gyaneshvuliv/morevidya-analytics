'use strict';

angular.module('colorAdminApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window,$rootScope,User,$cookieStore) {
    $("#accept").prop("disabled", true);
    $scope.user = {};
    $scope.errors = {};
    if ($cookieStore.get('email')) {
      $scope.user.email = $cookieStore.get('email');
      $scope.chkRememberMe = true;
    }
    if ($cookieStore.get('password')) {
      $scope.user.password = $cookieStore.get('password');
    }
    $scope.login = function(form) {
      $scope.submitted = true;

      // if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          if ($scope.chkRememberMe) {
            $cookieStore.put('email',$scope.user.email);
            $cookieStore.put('password',$scope.user.password);
          }else{
            $cookieStore.remove('email');
            $cookieStore.remove('password');
          }
          // Logged in, redirect to home
          // console.log(User.get());
          $rootScope.user = User.get();
          $location.path('/app/vuscreen/tracker');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    // };
    
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });

