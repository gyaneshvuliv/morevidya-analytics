var colorAdminApp = angular.module('colorAdminApp', [
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad',
    'ngCookies',
    'ngResource',
    'datatables',
    'angularFileUpload',
    'btorfs.multiselect'
    // 
    // 'uploadModule'
]);

colorAdminApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise('/app/dashboard');
    $urlRouterProvider.otherwise(function($injector, $location){
       var state = $injector.get('$state');
        $.get("app/session", function(data, status){
            if (status == 'success') {
                state.go('app.reports.tracker');
            }else{
                state.go('/login');
            }
        }).done(function() {
        }).fail(function() {
            state.go('/login');
        }).always(function() {
        });
        // state.go('app.dashboard');
        return $location.path();
    });
    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: '/template/V0.0.1/app.html',
            abstract: true
        })
    $locationProvider.html5Mode({
                                  enabled: true,
                                  requireBase: true
                                });    
}]);

colorAdminApp.run(['$rootScope', '$state', 'setting','$cookieStore', function($rootScope, $state, setting,$cookieStore) {
    $rootScope.$state = $state;
    $rootScope.setting = setting;
}]);
