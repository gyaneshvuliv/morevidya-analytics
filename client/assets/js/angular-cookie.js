/*   
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 1.9.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v1.9/admin/
*/

/* Global cookie Setting
------------------------------------------------ */

colorAdminApp.factory('cookie', ['$rootScope','$cookieStore', function($rootScope,$cookieStore) {
    var cookie = {
        stream: {
            value:function(val){ return (val - $cookieStore.get('streamVal')) }
        }
    };
    return cookie;
}]);