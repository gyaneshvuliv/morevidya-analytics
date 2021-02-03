'use strict';

angular.module('colorAdminApp')
  .controller('signupController', function ($scope, Auth, $location, $window,$rootScope, $state) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
    $rootScope.setting.layout.pageBgWhite = true;

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.fname + ' ' + $scope.user.lname,
          fname: $scope.user.fname,
          lname: $scope.user.lname,
          email: $scope.user.email,
          password: $scope.user.password,
          mobileNo: $scope.user.mobileNo,
          companyName: $scope.user.companyName,
        })
        .then( function() {
          // Account created, redirect to home
          alert('Account has been successfully genrated. Please check your email for account verification')
          $location.path('/login');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
