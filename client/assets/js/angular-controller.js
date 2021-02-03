/*   
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 1.9.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v1.9/admin/
    ----------------------------
        APPS CONTROLLER TABLE
    ----------------------------
    1.0 CONTROLLER - App
    2.0 CONTROLLER - Sidebar
    3.0 CONTROLLER - Right Sidebar
    4.0 CONTROLLER - Header
    5.0 CONTROLLER - Top Menu
    6.0 CONTROLLER - Page Loader
    7.0 CONTROLLER - Theme Panel
    8.0 CONTROLLER - Dashboard v1
    9.0 CONTROLLER - Dashboard v2
   10.0 CONTROLLER - Email Inbox v1
   11.0 CONTROLLER - Email Inbox v2
   12.0 CONTROLLER - Email Compose
   13.0 CONTROLLER - Email Detail
   14.0 CONTROLLER - UI Modal & Notifications
   15.0 CONTROLLER - UI Tree
   16.0 CONTROLLER - UI Language Bar
   17.0 CONTROLLER - Form Plugins
   18.0 CONTROLLER - Form Slider + Switcher
   19.0 CONTROLLER - Form Validation
   20.0 CONTROLLER - Table Manage Default
   21.0 CONTROLLER - Table Manage Autofill
   22.0 CONTROLLER - Table Manage Buttons
   23.0 CONTROLLER - Table Manage ColReorder
   24.0 CONTROLLER - Table Manage Fixed Columns
   25.0 CONTROLLER - Table Manage Fixed Header
   26.0 CONTROLLER - Table Manage KeyTable
   27.0 CONTROLLER - Table Manage Responsive
   28.0 CONTROLLER - Table Manage RowReorder
   29.0 CONTROLLER - Table Manage Scroller
   30.0 CONTROLLER - Table Manage Select
   31.0 CONTROLLER - Table Manage Extension Combination
   32.0 CONTROLLER - Flot Chart
   33.0 CONTROLLER - Morris Chart
   34.0 CONTROLLER - Chart JS
   35.0 CONTROLLER - Chart d3
   36.0 CONTROLLER - Calendar
   37.0 CONTROLLER - Vector Map
   38.0 CONTROLLER - Google Map
   39.0 CONTROLLER - Gallery V1
   40.0 CONTROLLER - Gallery V2
   41.0 CONTROLLER - Page with Footer
   42.0 CONTROLLER - Page without Sidebar
   43.0 CONTROLLER - Page with Right Sidebar
   44.0 CONTROLLER - Page with Minified Sidebar
   45.0 CONTROLLER - Page with Two Sidebar
   46.0 CONTROLLER - Full Height Content
   47.0 CONTROLLER - Page with Wide Sidebar
   48.0 CONTROLLER - Page with Light Sidebar
   49.0 CONTROLLER - Page with Mega Menu
   50.0 CONTROLLER - Page with Top Menu
   51.0 CONTROLLER - Page with Boxed Layout
   52.0 CONTROLLER - Page with Mixed Menu
   53.0 CONTROLLER - Page Boxed Layout with Mixed Menu
   54.0 CONTROLLER - Page with Transparent Sidebar
   55.0 CONTROLLER - Timeline
   56.0 CONTROLLER - Coming Soon
   57.0 CONTROLLER - 404 Error
   58.0 CONTROLLER - Login V1
   59.0 CONTROLLER - Login V2
   60.0 CONTROLLER - Login V3
   61.0 CONTROLLER - Register V3
   62.0 CONTROLLER - Stream View Controller
   63.0 CONTROLLER - Event Summary Controller
   64.0 CONTROLLER - Event Logs Controller
   65.0 CONTROLLER - Wallet Transaction Controller
    <!-- ======== GLOBAL SCRIPT SETTING ======== -->
*/


var blue		= '#348fe2',
    blueLight	= '#5da5e8',
    blueDark	= '#1993E4',
    aqua		= '#49b6d6',
    aquaLight	= '#6dc5de',
    aquaDark	= '#3a92ab',
    green		= '#00acac',
    greenLight	= '#33bdbd',
    greenDark	= '#008a8a',
    orange		= '#f59c1a',
    orangeLight	= '#f7b048',
    orangeDark	= '#c47d15',
    dark		= '#2d353c',
    grey		= '#b6c2c9',
    purple		= '#727cb6',
    purpleLight	= '#8e96c5',
    purpleDark	= '#5b6392',
    red         = '#ff5b57';
/* -------------------------------
   2.0 CONTROLLER - Sidebar
------------------------------- */
colorAdminApp.controller('sidebarController', function($scope, $rootScope, $state,cookie,$cookieStore, User) {
    // $scope.val = 12;
    // setInterval(function() {
    //     $scope.stream = cookie.stream.value(i);
    //     $scope.$apply();
    //     console.log($scope.stream )
    //     i = i + 10;
    // }, 100);
    $scope.user = {};
    if($cookieStore.get('token')) {
      $scope.user = User.get();
    }
    $scope.access = User.get()
    App.initSidebar();
});



/* -------------------------------
   3.0 CONTROLLER - Right Sidebar
------------------------------- */
colorAdminApp.controller('rightSidebarController', function($scope, $rootScope, $state) {
    var getRandomValue = function() {
        var value = [];
        for (var i = 0; i<= 19; i++) {
            value.push(Math.floor((Math.random() * 10) + 1));
        }
        return value;
    };

    $('.knob').knob();

    var blue		= '#348fe2', green		= '#00acac', purple		= '#727cb6', red         = '#ff5b57';
    var options = { height: '50px', width: '100%', fillColor: 'transparent', type: 'bar', barWidth: 8, barColor: green };

    var value = getRandomValue();
    $('#sidebar-sparkline-1').sparkline(value, options);

    value = getRandomValue();
    options.barColor = blue;
    $('#sidebar-sparkline-2').sparkline(value, options);

    value = getRandomValue();
    options.barColor = purple;
    $('#sidebar-sparkline-3').sparkline(value, options);

    value = getRandomValue();
    options.barColor = red;
    $('#sidebar-sparkline-4').sparkline(value, options);
});



/* -------------------------------
   4.0 CONTROLLER - Header
------------------------------- */
colorAdminApp.controller('headerController', function($scope, $rootScope, $state,Auth,User, $location,$cookieStore,blackbox,$http) {
    $scope.logout = function() {
      $cookieStore.remove('token');
      $cookieStore.remove('access');
      $location.path('/login');
    }
    $scope.user = {};
    if($cookieStore.get('token')) {
      $scope.user = User.get();
    }
    $scope.getSearchResult = function() {
        //$location.path('/app/search-results?search='+$scope.searchText);
        $location.path('/app/search-results');

    }
});



/* -------------------------------
   5.0 CONTROLLER - Top Menu
------------------------------- */
colorAdminApp.controller('topMenuController', function($scope, $rootScope, $state) {
    setTimeout(function() {
        App.initTopMenu();
    }, 0);
});



/* -------------------------------
   6.0 CONTROLLER - Page Loader
------------------------------- */
colorAdminApp.controller('pageLoaderController', function($scope, $rootScope, $state) {
    App.initPageLoad();
});

/* -------------------------------
   7.0 CONTROLLER - Theme Panel
------------------------------- */
colorAdminApp.controller('themePanelController', function($scope, $rootScope, $state) {
    App.initThemePanel();
});

/* -------------------------------
   39.0 CONTROLLER - Gallery V1
------------------------------- */
colorAdminApp.controller('galleryController', function($scope, $rootScope, $state) {

    function calculateDivider() {
        var dividerValue = 4;
        if ($(this).width() <= 480) {
            dividerValue = 1;
        } else if ($(this).width() <= 767) {
            dividerValue = 2;
        } else if ($(this).width() <= 980) {
            dividerValue = 3;
        }
        return dividerValue;
    }
    
    var container = $('#gallery');
    var dividerValue = calculateDivider();
    var containerWidth = $(container).width() - 20;
    var columnWidth = containerWidth / dividerValue;
    $(container).isotope({
        resizable: true,
        masonry: {
            columnWidth: columnWidth
        }
    });
    
    $(window).smartresize(function() {
        var dividerValue = calculateDivider();
        var containerWidth = $(container).width() - 20;
        var columnWidth = containerWidth / dividerValue;
        $(container).isotope({
            masonry: { 
                columnWidth: columnWidth 
            }
        });
    });
    
    var $optionSets = $('#options .gallery-option-set'),
    $optionLinks = $optionSets.find('a');
    
    $optionLinks.click( function(){
        var $this = $(this);
        if ($this.hasClass('active')) {
            return false;
        }
        var $optionSet = $this.parents('.gallery-option-set');
        $optionSet.find('.active').removeClass('active');
        $this.addClass('active');
    
        var options = {};
        var key = $optionSet.attr('data-option-key');
        var value = $this.attr('data-option-value');
            value = value === 'false' ? false : value;
            options[ key ] = value;
        $(container).isotope( options );
        return false;
    });
});