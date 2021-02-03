'use strict';

//Data
var cities = [
      {
          city : 'India',
          desc : 'This is the best country in the world!',
          lat : 23.200000,
          long : 79.225487
      },
      {
          city : 'New Delhi',
          desc : 'The Heart of India!',
          lat : 28.500000,
          long : 77.250000
      },
      {
          city : 'Mumbai',
          desc : 'Bollywood city!',
          lat : 19.000000,
          long : 72.90000
      },
      {
          city : 'Kolkata',
          desc : 'Howrah Bridge!',
          lat : 22.500000,
          long : 88.400000
      },
      {
          city : 'Chennai  ',
          desc : 'Kathipara Bridge!',
          lat : 13.000000,
          long : 80.250000
      }
  ];

        

colorAdminApp.controller('MapController', function($scope, $http, $rootScope, $state,$cookieStore) {
  $rootScope.setting.layout.pageContentFullWidth = true;
  function loadChartData(data){
      $scope.count = data.length
      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(30.7164,76.7444),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // mapTypeId: google.maps.MapTypeId.HYBRID,
        disableDefaultUI: true,
        gestureHandling: 'greedy'
        // mapTypeControlOptions: {
        //   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        //   // position: google.maps.ControlPosition.TOP_CENTER
        // }
        // mapTypeId: google.maps.MapTypeId.TERRAIN
      }
      
      $scope.map = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
      var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}];
      // set default style 
      $scope.map.setOptions({styles: cobaltStyles});
      $scope.markers = [];

      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (info){
        var latLng = new google.maps.LatLng(info.lat,
            info.lng);
        var marker = new google.maps.Marker({'position': latLng});
        marker.content = '<div class="infoWindowContent">'+
                              '<div>'+
                                  '<h5>'+ info.vehicle_no+', '+ info.login_id+'</h5>'+
                                  '<b>'+info.source+' To '+ info.destination+'</b><br>'+
                                  '<b>Device ID - '+ info.view_android_id+'</b><br>'+
                                  '<b>Video Played - '+ info.played+'</b><b> Duration(M) - '+ info.duration+'</b><br>'+  
                                  '<b>interface - '+ info.interface+'</b><br>'+
                                  '<b>Model - '+ info.view_model+'</b><br>'+
                                  // '<a target="_blank" href="/app/audience/registered/'+info.uid+'"><b>View Profile</b></a>'+
                              '</div>'+
                          '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
        
      }  

      for (var i = 0; i < data.length; i++){
        createMarker(data[i]);
      }
      var markerCluster = new MarkerClusterer($scope.map, $scope.markers, {imagePath: '/app/map/images/m'});
      
      $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
      }
  }

  $scope.getData = function () {
      $scope.isLoading = true;
        //   $scope.searchText;
        //   $scope.interface;
      var url = "/api/map/user/location/data?bus="+$scope.bus+"&interface="+$scope.interface+"&searchText="+$scope.searchText;
      $http.get(url)
        .then(function(response) {
            $scope.isLoading = false;
            if(response.data== 0 && $scope.dpCampaign){
                $scope.select = "No record found."
                loadChartData([]);
            }else{
                loadChartData(response.data);
            }

        });
  };
  $scope.getbuslistData = function () {
      var url = "/api/map/buslist";
      $http.get(url)
          .then(function(response) {
              $scope.buslist = [];
              $scope.data = response.data;
              for (let index = 0; index < $scope.data.length; index++) {
                if($scope.data[index].vehicle_no != null){
                    $scope.buslist.push($scope.data[index].vehicle_no);
                }
              }
          });
  };
  //initialize functions
  $scope.getbuslistData()
});



function handleGoogleMapLoaded() {
    $(window).trigger('googleMapLoaded');
}
colorAdminApp.controller('mapGoogleController', function($scope, $rootScope, $state,$http,$timeout) {
    $rootScope.setting.layout.pageContentFullWidth = true;
    var promise={};
    var mapDefault;
    // List with all marker to check if exist
    var markerList = {};
    var title = "";
    var timers = [];
    $scope.count = 0
    // variable for marker info window
    var infowindow
    /**
     * Load marker to map
     */
    function loadMarker(markerData,type){
        // create new marker location
        var myLatlng = new google.maps.LatLng(markerData['lat'],markerData['lng']);
        var url = "";
        if (type == 'wallet') {
          title = '<div class="infoWindowContent">'+
                              '<div>'+
                                  '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                  '<b>Gender - '+ markerData.gender+'</b>'+
                                  '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                  '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                  '<b>Email - '+ markerData.email+'</b><br>'+
                                  '<b>created at - '+ markerData.creation_datetime +'</b><br>'+
                              '</div>'+
                          '</div>';
          // title = markerData['wallet_name'] + ', created at :' + markerData.creation_datetime;
          if (markerData.wallet_name == 'SH') {
              //image = "/assets/img/markers/oxigen.png";
          }else if (markerData.wallet_name == 'MK') {
              url = "/assets/img/markers/mobikwik.png";
          }else if (markerData.wallet_name == 'CT') {
              image = "/assets/img/markers/citrus.png";
          }else if (markerData.wallet_name == 'TS') {
              url = "/assets/img/markers/udio.png";
          }else if (markerData.wallet_name == 'OX') {
              url = "/assets/img/markers/oxigen.png";
          }else if (markerData.wallet_name == 'PB') {
              image = "/assets/img/markers/payback.png";
          }else if (markerData.wallet_name == 'PT') {
              url = "/assets/img/markers/paytm.png";
          }else{
              url = "/assets/img/markers/default.png";
          }
        }else if( type == 'wallet-transaction'){
          title = '<div class="infoWindowContent">'+
                              '<div>'+
                                  '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                  '<b>Gender - '+ markerData.gender+'</b>'+
                                  '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                  '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                  '<b>Email - '+ markerData.email+'</b><br>'+
                                  '<b>at - '+ markerData.transaction_datetime +'</b><br>'+
                              '</div>'+
                          '</div>';
          // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
          if (markerData.partner_code == 'SH') {
              //image = "/assets/img/markers/oxigen.png";
          }else if (markerData.partner_code == 'MK') {
              url = "/assets/img/markers/mobikwik.png";
          }else if (markerData.partner_code == 'CT') {
              image = "/assets/img/markers/citrus.png";
          }else if (markerData.partner_code == 'TS') {
              url = "/assets/img/markers/udio.png";
          }else if (markerData.partner_code == 'OX') {
              url = "/assets/img/markers/oxigen.png";
          }else if (markerData.partner_code == 'PB') {
              image = "/assets/img/markers/payback.png";
          }else if (markerData.partner_code == 'PT') {
              url = "/assets/img/markers/paytm.png";
          }else{
              url = "/assets/img/markers/default.png";
          }
        }else if( type == 'play'){
          title = '<div class="infoWindowContent">'+
                              '<div>'+
                                  // '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                  // '<b>Gender - '+ markerData.gender+'</b>'+
                                  // '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                  // '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                  // '<b>Email - '+ markerData.email+'</b><br>'+
                                //   '<b>Vehicle No - '+ markerData.vehicle_no+'</b>'+
                                //   '<b>, '+ markerData.source+' To '+markerData.destination+'</b><br>'+
                                  '<b>Name - '+ markerData.title+'</b>'+
                                  '<b>, Genre - '+ markerData.genre+'</b><br>'+
                                  '<b>Duration(M) - '+ markerData.view_duration+'</b><b>, Interface - '+ markerData.interface+'</b><br>'+
                                  '<b>Device ID - '+ markerData.view_android_id+'</b><b>, Model - '+ markerData.view_model+'</b><br>'+
                                  '<b>viewed at - '+ markerData.view_datetime +'</b><br>'+
                              '</div>'+
                          '</div>';
          // title = markerData['channel'] + ', viewed at :' + markerData.sync_datetime;
          if (markerData.channel == 'voot') {
              url = "/assets/img/markers/voot.png";
          }else if (markerData.channel == 'spotboye') {
              url = "/assets/img/markers/spotboye.png";
          }else if (markerData.channel == 'comedy munch') {
              url = "/assets/img/markers/comedy-munch.png";
          }else if (markerData.channel == 'fever 104') {
              url = "/assets/img/markers/fever-104.png";
          }else if (markerData.channel == 'viral') {
              url = "/assets/img/markers/BBD.png";
          }else if (markerData.channel == 'audioboom') {
              url = "/assets/img/markers/audio-boom.png";
          }else if (markerData.channel == 'viu') {
              url = "/assets/img/markers/viu.png";
          }else if (markerData.channel == 'newsrepublic') {
              url = "/assets/img/markers/news-republic.png";
          }else if (markerData.channel == 'youtube') {
              url = "/assets/img/markers/youtube.png";
          }else if (markerData.channel == 'indiatv') {
              url = "/assets/img/markers/india-tv.png";
          }else if (markerData.channel == 'radio city') {
              url = "/assets/img/markers/radio-city.png";
          }else if (markerData.channel == 'ixigo') {
              url = "/assets/img/markers/ixigo.png";
          }else if (markerData.channel == 'indiatoday') {
              url = "/assets/img/markers/india-today.png";
          }else if (markerData.channel == 'babystep') {
              url = "/assets/img/markers/baby-step.png";
          }else if (markerData.channel == 'scoopwhoop') {
              url = "/assets/img/markers/scoopwhoop.png";
          }else if (markerData.channel == 'mauj') {
              url = "/assets/img/markers/mauj.png";
          }else if (markerData.channel == 'happifii') {
              url = "/assets/img/markers/happify.png";
          }else if (markerData.channel == 'dailymotion') {
              url = "/assets/img/markers/dailymotion.png";
          }else if (markerData.channel == 'dainik bhaskar') {
              url = "/assets/img/markers/danik-bhaskar.png";
          }else if (markerData.channel == 'hotstar') {
              url = "/assets/img/markers/hotstart.png";
          }else if (markerData.channel == 'bagnetwork') {
              url = "/assets/img/markers/bag-network.png";
          }else if (markerData.channel == 'bandviews') {
              url = "/assets/img/markers/bandviews.png";
          }else if (markerData.channel == 'fame2') {
              url = "/assets/img/markers/default.png";
          }else if (markerData.channel == 'gazabpost') {
              url = "/assets/img/markers/gajab-post.png";
          }else if (markerData.channel == 'khabarindia') {
              url = "/assets/img/markers/khabarindia.png";
          }else if (markerData.channel == 'swanbay tv') {
              url = "/assets/img/markers/swanbay-tv.png";
          }else if (markerData.channel == 'utvbindass') {
              url = "/assets/img/markers/utvbindass.png";
          }else{
              url = "/assets/img/markers/default.png";
          }
        }else if(type == 'ads'){
            title = '<div class="infoWindowContent">'+
                        '<div>'+
                            // '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                            // '<b>Gender - '+ markerData.gender+'</b>'+
                            // '<b>, DOB - '+ markerData.dob+'</b><br>'+
                            // '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                            // '<b>Email - '+ markerData.email+'</b><br>'+
                            // '<b>Vehicle No - '+ markerData.vehicle_no+'</b>'+
                            // '<b>, '+ markerData.source+' To '+markerData.destination+'</b><br>'+
                            '<b>Name - '+ markerData.title+'</b>'+
                            '<b>, Genre - '+ markerData.genre+'</b><br>'+
                            '<b>Duration(S) - '+ markerData.view_duration+'</b><b>, Interface - '+ markerData.interface+'</b><br>'+
                            '<b>Device ID - '+ markerData.view_android_id+'</b><b>, Model - '+ markerData.view_model+'</b><br>'+
                            '<b>viewed at - '+ markerData.view_datetime +'</b><br>'+
                        '</div>'+
                    '</div>';
          // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
          // if (markerData.partner == 'Tag your video') {url = 'http://content1.vuliv.com/packages/1505716400932_vuliv.png'
          // }else if (markerData.partner == 'Airtel') {url = 'http://content1.vuliv.com/packages/1505716399304_airccm.png'
          // }else if (markerData.partner == 'Voda') {url = 'http://content1.vuliv.com/packages/1505716400974_vdfone.png'
          // }else if (markerData.partner == 'Jio') {url = 'http://content1.vuliv.com/packages/1505716555581_jiopay.png'
          // }else if (markerData.partner == 'Samsung') {url = 'http://content1.vuliv.com/packages/1505716555494_samsung.png'
          // }else if (markerData.partner == 'Xiaomi') {url = 'http://content1.vuliv.com/packages/1505716555542_xiaomi.png'
          // }else if (markerData.partner == 'Micromax') {url = 'http://content1.vuliv.com/packages/1505814932643_mmx.png'
          // }else if (markerData.partner == 'Airtel') {url = 'http://content1.vuliv.com/packages/1505814195796_airapp.png'
          // }else if (markerData.partner == 'PM Awas Yogna') {url = 'http://content1.vuliv.com/packages/1505814197095_ncrpro.png'
          // }else if (markerData.partner == 'Income Tax e-filling') {url = 'http://content1.vuliv.com/packages/1505814197151_itdefl.png'
          // }else if (markerData.partner == 'My Gov') {url = 'http://content1.vuliv.com/packages/1505814197196_mygovt.png'
          // }else if (markerData.partner == 'Aadhaar') {url = 'http://content1.vuliv.com/packages/1505814197250_adhaar.png'
          // }else if (markerData.partner == 'PM Awas Yogna') {url = 'http://content1.vuliv.com/packages/1505814197284_tinyor.png'
          // }else if (markerData.partner == 'YU Mobile') {url = 'http://content1.vuliv.com/packages/1505814439909_yu.png'
          // }else if (markerData.partner == 'Sony') {url = 'http://content1.vuliv.com/packages/1505814440040_sonymo.png'
          // }else if (markerData.partner == 'Motorola') {url = 'http://content1.vuliv.com/packages/1505814440080_motorola.png'
          // }else if (markerData.partner == 'Lenskart') {url = 'http://content1.vuliv.com/packages/1505814618889_lnskrt.png'
          // }else if (markerData.partner == 'Domino\s') {url = 'http://content1.vuliv.com/packages/1505814668408_domino.png'
          // }else if (markerData.partner == 'HDFC') {url = 'http://content1.vuliv.com/packages/1505818264192_hdfcbk.png'
          // }else if (markerData.partner == 'Yatra') {url = 'http://content1.vuliv.com/packages/1505818264278_ayatra.png'
          // }else if (markerData.partner == 'Goibibo') {url = 'http://content1.vuliv.com/packages/1505818310174_goibib.png'
          // }else if (markerData.partner == 'Youtube') {url = 'http://content1.vuliv.com/packages/1507183781120_ytube.png'
          // }else if (markerData.partner == 'Whatsapp') {url = 'http://content1.vuliv.com/packages/1505899439980_whatsapp.png'
          // }else if (markerData.partner == 'Kotak') {url = 'http://content1.vuliv.com/packages/1505899440830_kotakb.png'
          // }else if (markerData.partner == 'Google Pixel') {url = 'http://content1.vuliv.com/packages/1505899440873_nexus.png'
          // }else if (markerData.partner == 'Payback') {url = 'http://content1.vuliv.com/packages/1505899440938_paybak.png'
          // }else if (markerData.partner == 'OnePlus') {url = 'http://content1.vuliv.com/packages/1505899672130_oneplus.png'
          // }else if (markerData.partner == 'Book My Show') {url = 'http://content1.vuliv.com/packages/1505899672252_bkshow.png'
          // }else if (markerData.partner == 'Airtel Bank') {url = 'http://content1.vuliv.com/packages/1505899840223_airbnk.png'
          // }else if (markerData.partner == 'Vivo Mobile') {url = 'http://content1.vuliv.com/packages/1505899840318_vivo.png'
          // }else if (markerData.partner == 'Shoppers Stop') {url = 'http://content1.vuliv.com/packages/1505899840357_fctzen.png'
          // }else if (markerData.partner == 'Food Panda') {url = 'http://content1.vuliv.com/packages/1505814618931_fpanda.png'
          // }else if (markerData.partner == 'Faasos') {url = 'http://content1.vuliv.com/packages/1505899440898_faasos.png'
          // }else if (markerData.partner == 'Eazydiner') {url = 'http://content1.vuliv.com/packages/1507541964173_easydiner.png'
          // }else if (markerData.partner == 'Swiggy') {url = 'http://content1.vuliv.com/packages/1507536965596_swiggy.png'
          // }else{
          //   url = "/assets/img/markers/default.png";
          // }
          if(markerData.view_id == 728){
            url = "/assets/img/markers/ceat.png";
          }else if(markerData.view_id ==729){
            url = "/assets/img/markers/godrej.png";
          }else if(markerData.view_id ==730){
            url = "/assets/img/markers/vip.png";
          }else{
            url = "/assets/img/markers/default.png";
          }
        }else{
          title = '<div class="infoWindowContent">'+
                              '<div>'+
                                  '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                  '<b>Gender - '+ markerData.gender+'</b>'+
                                  '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                  '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                  '<b>Email - '+ markerData.email+'</b><br>'+
                                  '<b>Name - '+ markerData.partner+'</b>'+
                                  '<b>, Channel - '+ markerData.channel+'</b><br>'+
                                  '<b>Category - '+ markerData.category+'</b><br>'+
                                  '<b>Action - '+ markerData.action+'</b><br>'+
                                  '<b>viewed at - '+ markerData.sync_datetime +'</b><br>'+
                              '</div>'+
                          '</div>';
          // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
          url = "/assets/img/markers/default.png";
        }
        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: url,
          // This marker is 90 pixels wide by 90 pixels high.
          size: new google.maps.Size(45, 45),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 22),
          // scaled size
          //scaledSize: new google.maps.Size(50, 50),
        };
        // create new marker
        // console.log(image);
        var marker = new google.maps.Marker({
          id: markerData['uniqueId'],
          map: mapDefault,
          draggable: true,
          icon:url,
          animation: google.maps.Animation.DROP,
          title: title,
          position: myLatlng
        });
        // add marker to list used later to get content and additional marker information
        markerList[marker.id] = marker;
        // add event listener when marker is clicked
        // currently the marker data contain a dataurl field this can of course be done different
        google.maps.event.addListener(marker, 'click', function() {
            // show marker when clicked
            showMarker(marker.id);
        });
        // add event when marker window is closed to reset map location
        google.maps.event.addListener(infowindow,'closeclick', function() {
            // mapDefault.setCenter(defaultLatlng);
            // mapDefault.setZoom(defaultZoom);
        });
    }
    /**
     * Load markers via ajax request from server
     */
    $scope.loadMarkers =  {
      // /* call ajax call to get graph data
      // ------------------------- */
      // var url = "/api/audiences/newWallet/geography/wise?";
      // if ($scope.id) {
      //     url = url+"id="+$scope.id
      // }
      // $http({url:url,method: "GET"})
      //   .success(function (data, status, headers, config) {
      //     if (data.length > 0) {
      //       $scope.id = data[0].id
      //     };
      //     // loop all the markers
      //     $.each(data, function(i,item){
      //       // add marker to map
      //       window.setTimeout(function() {
      //           loadMarker(item,'wallet')
      //       }, i * 200);
      //     });
      //     // $timeout(function(){$scope.loadMarkers();}, 10000);
      //     var play_url = "/api/views/play/geography/wise?";
      //     if ($scope.play_id) {
      //       play_url = play_url+"id="+$scope.play_id
      //     }
      //     $http({url:play_url,method: "GET"})
      //       .success(function (data, status, headers, config) {
      //         if (data.length > 0) {
      //             $scope.play_id = data[0].id
      //         };
      //         // loop all the markers
      //         $.each(data, function(i,item){
      //           // add marker to map
      //           window.setTimeout(function() {
      //               loadMarker(item,'play')
      //           }, i * 200);
      //         });
      //         var promise = $timeout(function(){$scope.loadMarkers();}, 10000);
      //       }).error(function (data, status, headers, config) {
      //           console.log(data)
      //       });
      //   }).error(function (data, status, headers, config) {
      //       console.log(data)
      //   });
      GetNewWalletData: function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/audiences/newWallet/geography/wise?";
        if ($scope.wallet_id) {
            url = url+"id="+$scope.wallet_id
        }
        $http({url:url,method: "GET"})
          .success(function (data, status, headers, config) {
            //if (data.length > 0) {
            //  $scope.wallet_id = data[data.length - 1].id
            //};
            var pre = 0;
            // loop all the markers
            $.each(data, function(i,item){
              if (pre < item.id) {
                pre = item.id;
                $scope.wallet_id = pre;
              }
              // add marker to map
              var t = window.setTimeout(function() {
                  loadMarker(item,'wallet')
              }, i * 200);
              timers.push(t);
              $scope.count = timers.length
            });
            promise['wallet'] = $timeout(function(){$scope.loadMarkers.GetNewWalletData();}, 10000);
          }).error(function (data, status, headers, config) {
              console.log(data)
          });
      },
      GetWalletTransactionData: function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/transactions/wallet/geography/wise?";
        if ($scope.wallet_trans_id) {
            url = url+"id="+$scope.wallet_trans_id
        }
        $http({url:url,method: "GET"})
          .success(function (data, status, headers, config) {
            //if (data.length > 0) {
            //  $scope.wallet_trans_id = data[data.length - 1].id
            //};
            var pre = 0;
            // loop all the markers
            $.each(data, function(i,item){
              if (pre < item.id) {
                pre = item.id;
                $scope.wallet_trans_id = pre;
              }
              // add marker to map
              var t = window.setTimeout(function() {
                  loadMarker(item,'wallet-transaction')
              }, i * 200);
              timers.push(t);
              $scope.count = timers.length
            });
            promise['wallet_transaction'] = $timeout(function(){$scope.loadMarkers.GetWalletTransactionData();}, 10000);
          }).error(function (data, status, headers, config) {
              console.log(data)
          });
      },
      GetPlayViewData: function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/map/play/geography/wise?";
        if ($scope.play_id) {
            url = url+"id="+$scope.play_id
        }
        $http({url:url,method: "GET"})
          .success(function (data, status, headers, config) {
            //if (data.length > 0) {
            //  $scope.play_id = data[data.length - 1].id
            //};
            var pre = 0;
            // loop all the markers
            $.each(data, function(i,item){
             if (pre < item.id) {
                pre = item.id;
                $scope.play_id = pre;
              }
              // add marker to map
             var t =  window.setTimeout(function() {
                  loadMarker(item,'play')
              }, i * 200);
             timers.push(t);
             $scope.count = timers.length
            });
            promise['play'] = $timeout(function(){$scope.loadMarkers.GetPlayViewData();}, 10000);
          }).error(function (data, status, headers, config) {
              console.log(data)
          });
      },
      GetAdsViewData: function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/map/ads/geography/wise?";
        if ($scope.ads_id) {
            url = url+"id="+$scope.ads_id
        }
        $http({url:url,method: "GET"})
          .success(function (data, status, headers, config) {
            //if (data.length > 0) {
            //  $scope.ads_id = data[data.length - 1].id
            //};
            var pre = 0;
            // loop all the markers
            $.each(data, function(i,item){
             if (pre < item.id) {
                pre = item.id;
                $scope.ads_id = pre;
              }
              // add marker to map
             var t =  window.setTimeout(function() {
                  loadMarker(item,'ads')
              }, i * 200);
             timers.push(t);
             $scope.count = timers.length
            });
            promise['ads'] = $timeout(function(){$scope.loadMarkers.GetAdsViewData();}, 10000);
          }).error(function (data, status, headers, config) {
              console.log(data)
          });
      },
      GetDealsViewData: function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/events/vudeal/geography/wise?";
        if ($scope.deals_id) {
            url = url+"id="+$scope.deals_id
        }
        $http({url:url,method: "GET"})
          .success(function (data, status, headers, config) {
            //if (data.length > 0) {
            //  $scope.deals_id = data[data.length - 1].id
            //};
            var pre = 0;
            // loop all the markers
            $.each(data, function(i,item){
             if (pre < item.id) {
                pre = item.id;
                $scope.deals_id = pre;
              }
              // add marker to map
             var t =  window.setTimeout(function() {
                  loadMarker(item,'deals')
              }, i * 200);
             timers.push(t);
             $scope.count = timers.length
            });
            promise['deals'] = $timeout(function(){$scope.loadMarkers.GetDealsViewData();}, 10000);
          }).error(function (data, status, headers, config) {
              console.log(data)
          });
      }          
    }
    /**
     * Show marker info window
     */
    function showMarker(markerId){

        // get marker information from marker list
        var marker = markerList[markerId];
        // check if marker was found
        if( marker ){
            // get marker detail information from server
            // $.get( 'data/' + marker.id + '.html' , function(data) 
            //     // show marker window
            //     infowindow.setContent(data);
            //     infowindow.open(mapDefault,marker);
            // });
            infowindow.setContent(marker.title);
            infowindow.open(mapDefault,marker);
        }else{
            alert('Error marker not found: ' + markerId);
        }
    }
    function initialize() {
        var mapOptions = {
            zoom: 12,
            // center: new google.maps.LatLng(-33.397, 145.644),
            center: new google.maps.LatLng(30.7164,76.7444),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        };
        mapDefault = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
        var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}];
        // set default style 
        mapDefault.setOptions({styles: cobaltStyles});
        $('#content').addClass('content-inverse-mode');
        // create new info window for marker detail pop-up
        infowindow = new google.maps.InfoWindow();
        // $scope.loadMarkers();
    }
    initialize();
    $scope.play_id = false;
    $scope.loadMarkers.GetPlayViewData();
    $('[data-map-activity]').click(function() {
        var targetTheme = $(this).attr('data-map-activity');
        var targetLi = $(this).closest('li');
        var targetText = $(this).text();
        var inverseContentMode = false;
        $('#map-activity-selection li').not(targetLi).removeClass('active');
        $('#map-activity-text').text(targetText);
        $(targetLi).addClass('active');
        var keys = Object.keys(promise);
        for (var i = 0; i < keys.length; i++) {
          $timeout.cancel(promise[keys[i]]);   
        }
	  for (var i = 0; i < timers.length; i++) {
          window.clearTimeout(timers[i]);
        }
        initialize();
        var marker = Object.keys(markerList);
        for (var i = 0; i < marker.length; i++) {
          markerList[marker[i]].setMap(null);
        }
        switch(targetTheme) {
          case 'All':
            $scope.wallet_id = false;
            $scope.loadMarkers.GetNewWalletData();
            
            $scope.wallet_trans_id = false;
            $scope.loadMarkers.GetWalletTransactionData()

            $scope.play_id = false;
            $scope.loadMarkers.GetPlayViewData();

            $scope.ads_id = false;
            $scope.loadMarkers.GetAdsViewData();

            $scope.deals_id = false;
            $scope.loadMarkers.GetDealsViewData();
            break;
          case 'new-wallet':
            $scope.wallet_id = false;
            $scope.loadMarkers.GetNewWalletData();
            break;
          case 'wallet-transaction':
            $scope.wallet_trans_id = false;
            $scope.loadMarkers.GetWalletTransactionData()
            break;
          case 'play-view':
            $scope.play_id = false;
            $scope.loadMarkers.GetPlayViewData();
            break;
          case 'dau':
            break;
          case 'my-media-view':
            break;
          case 'campaing-view':
            break;
          case 'ads-view':
            $scope.ads_id = false;
            $scope.loadMarkers.GetAdsViewData();
            break;
          case 'deals-view':
            $scope.deals_id = false;
            $scope.loadMarkers.GetDealsViewData();
            break;  
          default:
            $scope.id = false;
            $scope.loadMarkers.GetNewWalletData();
            break;
        }
  });
    // $(window).unbind('googleMapLoaded');
    // $(window).bind('googleMapLoaded', initialize);
    // $.getScript("http://maps.google.com/maps/api/js?sensor=false&key=AIzaSyDceUuy_GNVbSgK16QNXKPR3pRVuxv4iB8&callback=handleGoogleMapLoaded");
    
    $(window).resize(function() {
        google.maps.event.trigger(mapDefault, "resize");
    });
    $scope.$on('$destroy',function(){
      //if(promise){
      //  $interval.cancel(promise);   
      //}
      var keys = Object.keys(promise);
      for (var i = 0; i < keys.length; i++) {
        $timeout.cancel(promise[keys[i]]);   
      }
    });
});

colorAdminApp.controller('vpMapController', function($scope, $http, $rootScope, $state,$cookieStore) {
    $rootScope.setting.layout.pageContentFullWidth = true;
    function loadChartData(data){
        $scope.count = data.length
        var mapOptions = {
          zoom: 7,
          center: new google.maps.LatLng(28.5057,77.0837),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          // mapTypeId: google.maps.MapTypeId.HYBRID,
          disableDefaultUI: true,
          gestureHandling: 'greedy'
          // mapTypeControlOptions: {
          //   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          //   // position: google.maps.ControlPosition.TOP_CENTER
          // }
          // mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        
        $scope.map = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
        var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}];
        // set default style 
        $scope.map.setOptions({styles: cobaltStyles});
        $scope.markers = [];
  
        var infoWindow = new google.maps.InfoWindow();
  
        var createMarker = function (info){
          var latLng = new google.maps.LatLng(info.latitude,
              info.longitude);
          var marker = new google.maps.Marker({'position': latLng});
          marker.content = '<div class="infoWindowContent">'+
                                '<div>'+
                                    '<h5>'+ info.name+'</h5>'+
                                    // '<img style="width: 80px;" src="'+info.profile_pic+'" /><br>'+
                                    '<b>Phone No - '+ info.phone_no+'</b><br>'+  
                                    '<b>Gender - '+ info.gender+'</b><br>'+
                                    '<b>AGE - '+ info.age+'</b><br>'+
                                    '<b>Android ID - '+ info.android_id+'</b><br>'+
                                    '<b>interface - '+ info._interface+'</b><br>'+
                                    '<b>Model - '+ info.model+'</b><br>'+
                                    // '<a target="_blank" href="/app/audience/registered/'+info.uid+'"><b>View Profile</b></a>'+
                                '</div>'+
                            '</div>';
          google.maps.event.addListener(marker, 'click', function(){
              infoWindow.setContent(marker.content);
              infoWindow.open($scope.map, marker);
          });
          
          $scope.markers.push(marker);
          
        }  
  
        for (var i = 0; i < data.length; i++){
          createMarker(data[i]);
        }
        var markerCluster = new MarkerClusterer($scope.map, $scope.markers, {imagePath: '/app/map/images/m'});
        
        $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
        }
    }
  
    $scope.getData = function () {
        // $scope.select = ""
        $scope.isLoading = true;
        // var a = "'"+$scope.dpCampaign+"'"
        // console.log(a)
        $scope.searchText;
        
        $scope.interface;
        // if($scope.version == "undefined" || typeof($scope.version) == "undefined"){
        //   $scope.version = '5.0.0'
        // }
        var url = "/api/map/vp/user/location/data?version="+$scope.version+"&interface="+$scope.interface+"&searchText="+$scope.searchText;
        $http.get(url)
          .then(function(response) {
              $scope.isLoading = false;
              if(response.data== 0 && $scope.dpCampaign){
                  $scope.select = "No record found."
                  loadChartData([]);
              }else{
                  loadChartData(response.data);
              }
  
          });
    };
    $scope.getversionlistData = function () {
               
        $scope.versions= [
            '5.0.1','5.0.0','4.1.2','4.1.1','4.1.0','4.0.2','4.0.1',
            '4.0.0','3.0.2','3.0.1','3.0.0','2.9.0','2.3.3',
            '2.3.2','2.3.1','2.3.0','2.2.0','2.1.1','2.1.0',
            '2.0.3','2.0.0','1.3.5','1.3.4','1.3.3','1.3.2',
            '1.3.1','1.3.0','1.2.1','1.2.0','1.1.0','1.0.3'
          ]
        $scope.version = ["5.0.1"];  
    };
    //initialize functions
    // $scope.getversionlistData()
    $scope.getData()
  });
  
  
colorAdminApp.controller('vpmapGoogleController', function($scope, $rootScope, $state,$http,$timeout) {
      $rootScope.setting.layout.pageContentFullWidth = true;
      var promise={};
      var mapDefault;
      // List with all marker to check if exist
      var markerList = {};
      var title = "";
      var timers = [];
      $scope.count = 0
      // variable for marker info window
      var infowindow
      /**
       * Load marker to map
       */
      function loadMarker(markerData,type){
          // create new marker location
          var myLatlng = new google.maps.LatLng(markerData['lat'],markerData['lng']);
          var url = "";
          if (type == 'wallet') {
            title = '<div class="infoWindowContent">'+
                                '<div>'+
                                    '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                    '<b>Gender - '+ markerData.gender+'</b>'+
                                    '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                    '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                    '<b>Email - '+ markerData.email+'</b><br>'+
                                    '<b>created at - '+ markerData.creation_datetime +'</b><br>'+
                                '</div>'+
                            '</div>';
            // title = markerData['wallet_name'] + ', created at :' + markerData.creation_datetime;
            if (markerData.wallet_name == 'SH') {
                //image = "/assets/img/markers/oxigen.png";
            }else if (markerData.wallet_name == 'MK') {
                url = "/assets/img/markers/mobikwik.png";
            }else if (markerData.wallet_name == 'CT') {
                image = "/assets/img/markers/citrus.png";
            }else if (markerData.wallet_name == 'TS') {
                url = "/assets/img/markers/udio.png";
            }else if (markerData.wallet_name == 'OX') {
                url = "/assets/img/markers/oxigen.png";
            }else if (markerData.wallet_name == 'PB') {
                image = "/assets/img/markers/payback.png";
            }else if (markerData.wallet_name == 'PT') {
                url = "/assets/img/markers/paytm.png";
            }else{
                url = "/assets/img/markers/default.png";
            }
          }else if( type == 'wallet-transaction'){
            title = '<div class="infoWindowContent">'+
                                '<div>'+
                                    '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                    '<b>Gender - '+ markerData.gender+'</b>'+
                                    '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                    '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                    '<b>Email - '+ markerData.email+'</b><br>'+
                                    '<b>at - '+ markerData.transaction_datetime +'</b><br>'+
                                '</div>'+
                            '</div>';
            // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
            if (markerData.partner_code == 'SH') {
                //image = "/assets/img/markers/oxigen.png";
            }else if (markerData.partner_code == 'MK') {
                url = "/assets/img/markers/mobikwik.png";
            }else if (markerData.partner_code == 'CT') {
                image = "/assets/img/markers/citrus.png";
            }else if (markerData.partner_code == 'TS') {
                url = "/assets/img/markers/udio.png";
            }else if (markerData.partner_code == 'OX') {
                url = "/assets/img/markers/oxigen.png";
            }else if (markerData.partner_code == 'PB') {
                image = "/assets/img/markers/payback.png";
            }else if (markerData.partner_code == 'PT') {
                url = "/assets/img/markers/paytm.png";
            }else{
                url = "/assets/img/markers/default.png";
            }
          }else if( type == 'play'){
            title = '<div class="infoWindowContent">'+
                                '<div>'+
                                    // '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                    // '<b>Gender - '+ markerData.gender+'</b>'+
                                    // '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                    // '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                    // '<b>Email - '+ markerData.email+'</b><br>'+
                                  //   '<b>Vehicle No - '+ markerData.vehicle_no+'</b>'+
                                  //   '<b>, '+ markerData.source+' To '+markerData.destination+'</b><br>'+
                                    '<b>Name - '+ markerData.title+'</b>'+
                                    '<b>, Genre - '+ markerData.genre+'</b><br>'+
                                    '<b>Duration(M) - '+ markerData.view_duration+'</b><b>, Interface - '+ markerData.interface+'</b><br>'+
                                    '<b>Device ID - '+ markerData.view_android_id+'</b><b>, Model - '+ markerData.view_model+'</b><br>'+
                                    '<b>viewed at - '+ markerData.view_datetime +'</b><br>'+
                                '</div>'+
                            '</div>';
            // title = markerData['channel'] + ', viewed at :' + markerData.sync_datetime;
            if (markerData.channel == 'voot') {
                url = "/assets/img/markers/voot.png";
            }else if (markerData.channel == 'spotboye') {
                url = "/assets/img/markers/spotboye.png";
            }else if (markerData.channel == 'comedy munch') {
                url = "/assets/img/markers/comedy-munch.png";
            }else if (markerData.channel == 'fever 104') {
                url = "/assets/img/markers/fever-104.png";
            }else if (markerData.channel == 'viral') {
                url = "/assets/img/markers/BBD.png";
            }else if (markerData.channel == 'audioboom') {
                url = "/assets/img/markers/audio-boom.png";
            }else if (markerData.channel == 'viu') {
                url = "/assets/img/markers/viu.png";
            }else if (markerData.channel == 'newsrepublic') {
                url = "/assets/img/markers/news-republic.png";
            }else if (markerData.channel == 'youtube') {
                url = "/assets/img/markers/youtube.png";
            }else if (markerData.channel == 'indiatv') {
                url = "/assets/img/markers/india-tv.png";
            }else if (markerData.channel == 'radio city') {
                url = "/assets/img/markers/radio-city.png";
            }else if (markerData.channel == 'ixigo') {
                url = "/assets/img/markers/ixigo.png";
            }else if (markerData.channel == 'indiatoday') {
                url = "/assets/img/markers/india-today.png";
            }else if (markerData.channel == 'babystep') {
                url = "/assets/img/markers/baby-step.png";
            }else if (markerData.channel == 'scoopwhoop') {
                url = "/assets/img/markers/scoopwhoop.png";
            }else if (markerData.channel == 'mauj') {
                url = "/assets/img/markers/mauj.png";
            }else if (markerData.channel == 'happifii') {
                url = "/assets/img/markers/happify.png";
            }else if (markerData.channel == 'dailymotion') {
                url = "/assets/img/markers/dailymotion.png";
            }else if (markerData.channel == 'dainik bhaskar') {
                url = "/assets/img/markers/danik-bhaskar.png";
            }else if (markerData.channel == 'hotstar') {
                url = "/assets/img/markers/hotstart.png";
            }else if (markerData.channel == 'bagnetwork') {
                url = "/assets/img/markers/bag-network.png";
            }else if (markerData.channel == 'bandviews') {
                url = "/assets/img/markers/bandviews.png";
            }else if (markerData.channel == 'fame2') {
                url = "/assets/img/markers/default.png";
            }else if (markerData.channel == 'gazabpost') {
                url = "/assets/img/markers/gajab-post.png";
            }else if (markerData.channel == 'khabarindia') {
                url = "/assets/img/markers/khabarindia.png";
            }else if (markerData.channel == 'swanbay tv') {
                url = "/assets/img/markers/swanbay-tv.png";
            }else if (markerData.channel == 'utvbindass') {
                url = "/assets/img/markers/utvbindass.png";
            }else{
                url = "/assets/img/markers/default.png";
            }
          }else if(type == 'ads'){
              title = '<div class="infoWindowContent">'+
                          '<div>'+
                              // '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                              // '<b>Gender - '+ markerData.gender+'</b>'+
                              // '<b>, DOB - '+ markerData.dob+'</b><br>'+
                              // '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                              // '<b>Email - '+ markerData.email+'</b><br>'+
                              // '<b>Vehicle No - '+ markerData.vehicle_no+'</b>'+
                              // '<b>, '+ markerData.source+' To '+markerData.destination+'</b><br>'+
                              '<b>Name - '+ markerData.title+'</b>'+
                              '<b>, Genre - '+ markerData.genre+'</b><br>'+
                              '<b>Duration(S) - '+ markerData.view_duration+'</b><b>, Interface - '+ markerData.interface+'</b><br>'+
                              '<b>Device ID - '+ markerData.view_android_id+'</b><b>, Model - '+ markerData.view_model+'</b><br>'+
                              '<b>viewed at - '+ markerData.view_datetime +'</b><br>'+
                          '</div>'+
                      '</div>';
            // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
            // if (markerData.partner == 'Tag your video') {url = 'http://content1.vuliv.com/packages/1505716400932_vuliv.png'
            // }else if (markerData.partner == 'Airtel') {url = 'http://content1.vuliv.com/packages/1505716399304_airccm.png'
            // }else if (markerData.partner == 'Voda') {url = 'http://content1.vuliv.com/packages/1505716400974_vdfone.png'
            // }else if (markerData.partner == 'Jio') {url = 'http://content1.vuliv.com/packages/1505716555581_jiopay.png'
            // }else if (markerData.partner == 'Samsung') {url = 'http://content1.vuliv.com/packages/1505716555494_samsung.png'
            // }else if (markerData.partner == 'Xiaomi') {url = 'http://content1.vuliv.com/packages/1505716555542_xiaomi.png'
            // }else if (markerData.partner == 'Micromax') {url = 'http://content1.vuliv.com/packages/1505814932643_mmx.png'
            // }else if (markerData.partner == 'Airtel') {url = 'http://content1.vuliv.com/packages/1505814195796_airapp.png'
            // }else if (markerData.partner == 'PM Awas Yogna') {url = 'http://content1.vuliv.com/packages/1505814197095_ncrpro.png'
            // }else if (markerData.partner == 'Income Tax e-filling') {url = 'http://content1.vuliv.com/packages/1505814197151_itdefl.png'
            // }else if (markerData.partner == 'My Gov') {url = 'http://content1.vuliv.com/packages/1505814197196_mygovt.png'
            // }else if (markerData.partner == 'Aadhaar') {url = 'http://content1.vuliv.com/packages/1505814197250_adhaar.png'
            // }else if (markerData.partner == 'PM Awas Yogna') {url = 'http://content1.vuliv.com/packages/1505814197284_tinyor.png'
            // }else if (markerData.partner == 'YU Mobile') {url = 'http://content1.vuliv.com/packages/1505814439909_yu.png'
            // }else if (markerData.partner == 'Sony') {url = 'http://content1.vuliv.com/packages/1505814440040_sonymo.png'
            // }else if (markerData.partner == 'Motorola') {url = 'http://content1.vuliv.com/packages/1505814440080_motorola.png'
            // }else if (markerData.partner == 'Lenskart') {url = 'http://content1.vuliv.com/packages/1505814618889_lnskrt.png'
            // }else if (markerData.partner == 'Domino\s') {url = 'http://content1.vuliv.com/packages/1505814668408_domino.png'
            // }else if (markerData.partner == 'HDFC') {url = 'http://content1.vuliv.com/packages/1505818264192_hdfcbk.png'
            // }else if (markerData.partner == 'Yatra') {url = 'http://content1.vuliv.com/packages/1505818264278_ayatra.png'
            // }else if (markerData.partner == 'Goibibo') {url = 'http://content1.vuliv.com/packages/1505818310174_goibib.png'
            // }else if (markerData.partner == 'Youtube') {url = 'http://content1.vuliv.com/packages/1507183781120_ytube.png'
            // }else if (markerData.partner == 'Whatsapp') {url = 'http://content1.vuliv.com/packages/1505899439980_whatsapp.png'
            // }else if (markerData.partner == 'Kotak') {url = 'http://content1.vuliv.com/packages/1505899440830_kotakb.png'
            // }else if (markerData.partner == 'Google Pixel') {url = 'http://content1.vuliv.com/packages/1505899440873_nexus.png'
            // }else if (markerData.partner == 'Payback') {url = 'http://content1.vuliv.com/packages/1505899440938_paybak.png'
            // }else if (markerData.partner == 'OnePlus') {url = 'http://content1.vuliv.com/packages/1505899672130_oneplus.png'
            // }else if (markerData.partner == 'Book My Show') {url = 'http://content1.vuliv.com/packages/1505899672252_bkshow.png'
            // }else if (markerData.partner == 'Airtel Bank') {url = 'http://content1.vuliv.com/packages/1505899840223_airbnk.png'
            // }else if (markerData.partner == 'Vivo Mobile') {url = 'http://content1.vuliv.com/packages/1505899840318_vivo.png'
            // }else if (markerData.partner == 'Shoppers Stop') {url = 'http://content1.vuliv.com/packages/1505899840357_fctzen.png'
            // }else if (markerData.partner == 'Food Panda') {url = 'http://content1.vuliv.com/packages/1505814618931_fpanda.png'
            // }else if (markerData.partner == 'Faasos') {url = 'http://content1.vuliv.com/packages/1505899440898_faasos.png'
            // }else if (markerData.partner == 'Eazydiner') {url = 'http://content1.vuliv.com/packages/1507541964173_easydiner.png'
            // }else if (markerData.partner == 'Swiggy') {url = 'http://content1.vuliv.com/packages/1507536965596_swiggy.png'
            // }else{
            //   url = "/assets/img/markers/default.png";
            // }
            if(markerData.view_id == 728){
              url = "/assets/img/markers/ceat.png";
            }else if(markerData.view_id ==729){
              url = "/assets/img/markers/godrej.png";
            }else if(markerData.view_id ==730){
              url = "/assets/img/markers/vip.png";
            }else{
              url = "/assets/img/markers/default.png";
            }
          }else{
            title = '<div class="infoWindowContent">'+
                                '<div>'+
                                    '<b>'+ markerData.fname+' '+ markerData.lname+'</b><br>'+
                                    '<b>Gender - '+ markerData.gender+'</b>'+
                                    '<b>, DOB - '+ markerData.dob+'</b><br>'+
                                    '<b>MSISDN - '+ markerData.msisdn+'</b><br>'+
                                    '<b>Email - '+ markerData.email+'</b><br>'+
                                    '<b>Name - '+ markerData.partner+'</b>'+
                                    '<b>, Channel - '+ markerData.channel+'</b><br>'+
                                    '<b>Category - '+ markerData.category+'</b><br>'+
                                    '<b>Action - '+ markerData.action+'</b><br>'+
                                    '<b>viewed at - '+ markerData.sync_datetime +'</b><br>'+
                                '</div>'+
                            '</div>';
            // title = markerData['partner_code'] + ', at :' + markerData.transaction_datetime;
            url = "/assets/img/markers/default.png";
          }
          // Origins, anchor positions and coordinates of the marker increase in the X
          // direction to the right and in the Y direction down.
          var image = {
            url: url,
            // This marker is 90 pixels wide by 90 pixels high.
            size: new google.maps.Size(45, 45),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 22),
            // scaled size
            //scaledSize: new google.maps.Size(50, 50),
          };
          // create new marker
          // console.log(image);
          var marker = new google.maps.Marker({
            id: markerData['uniqueId'],
            map: mapDefault,
            draggable: true,
            icon:url,
            animation: google.maps.Animation.DROP,
            title: title,
            position: myLatlng
          });
          // add marker to list used later to get content and additional marker information
          markerList[marker.id] = marker;
          // add event listener when marker is clicked
          // currently the marker data contain a dataurl field this can of course be done different
          google.maps.event.addListener(marker, 'click', function() {
              // show marker when clicked
              showMarker(marker.id);
          });
          // add event when marker window is closed to reset map location
          google.maps.event.addListener(infowindow,'closeclick', function() {
              // mapDefault.setCenter(defaultLatlng);
              // mapDefault.setZoom(defaultZoom);
          });
      }
      /**
       * Load markers via ajax request from server
       */
      $scope.loadMarkers =  {
        // /* call ajax call to get graph data
        // ------------------------- */
        // var url = "/api/audiences/newWallet/geography/wise?";
        // if ($scope.id) {
        //     url = url+"id="+$scope.id
        // }
        // $http({url:url,method: "GET"})
        //   .success(function (data, status, headers, config) {
        //     if (data.length > 0) {
        //       $scope.id = data[0].id
        //     };
        //     // loop all the markers
        //     $.each(data, function(i,item){
        //       // add marker to map
        //       window.setTimeout(function() {
        //           loadMarker(item,'wallet')
        //       }, i * 200);
        //     });
        //     // $timeout(function(){$scope.loadMarkers();}, 10000);
        //     var play_url = "/api/views/play/geography/wise?";
        //     if ($scope.play_id) {
        //       play_url = play_url+"id="+$scope.play_id
        //     }
        //     $http({url:play_url,method: "GET"})
        //       .success(function (data, status, headers, config) {
        //         if (data.length > 0) {
        //             $scope.play_id = data[0].id
        //         };
        //         // loop all the markers
        //         $.each(data, function(i,item){
        //           // add marker to map
        //           window.setTimeout(function() {
        //               loadMarker(item,'play')
        //           }, i * 200);
        //         });
        //         var promise = $timeout(function(){$scope.loadMarkers();}, 10000);
        //       }).error(function (data, status, headers, config) {
        //           console.log(data)
        //       });
        //   }).error(function (data, status, headers, config) {
        //       console.log(data)
        //   });
        GetNewWalletData: function(){
          /* call ajax call to get graph data
          ------------------------- */
          var url = "/api/audiences/newWallet/geography/wise?";
          if ($scope.wallet_id) {
              url = url+"id="+$scope.wallet_id
          }
          $http({url:url,method: "GET"})
            .success(function (data, status, headers, config) {
              //if (data.length > 0) {
              //  $scope.wallet_id = data[data.length - 1].id
              //};
              var pre = 0;
              // loop all the markers
              $.each(data, function(i,item){
                if (pre < item.id) {
                  pre = item.id;
                  $scope.wallet_id = pre;
                }
                // add marker to map
                var t = window.setTimeout(function() {
                    loadMarker(item,'wallet')
                }, i * 200);
                timers.push(t);
                $scope.count = timers.length
              });
              promise['wallet'] = $timeout(function(){$scope.loadMarkers.GetNewWalletData();}, 10000);
            }).error(function (data, status, headers, config) {
                console.log(data)
            });
        },
        GetWalletTransactionData: function(){
          /* call ajax call to get graph data
          ------------------------- */
          var url = "/api/transactions/wallet/geography/wise?";
          if ($scope.wallet_trans_id) {
              url = url+"id="+$scope.wallet_trans_id
          }
          $http({url:url,method: "GET"})
            .success(function (data, status, headers, config) {
              //if (data.length > 0) {
              //  $scope.wallet_trans_id = data[data.length - 1].id
              //};
              var pre = 0;
              // loop all the markers
              $.each(data, function(i,item){
                if (pre < item.id) {
                  pre = item.id;
                  $scope.wallet_trans_id = pre;
                }
                // add marker to map
                var t = window.setTimeout(function() {
                    loadMarker(item,'wallet-transaction')
                }, i * 200);
                timers.push(t);
                $scope.count = timers.length
              });
              promise['wallet_transaction'] = $timeout(function(){$scope.loadMarkers.GetWalletTransactionData();}, 10000);
            }).error(function (data, status, headers, config) {
                console.log(data)
            });
        },
        GetPlayViewData: function(){
          /* call ajax call to get graph data
          ------------------------- */
          var url = "/api/map/play/geography/wise?";
          if ($scope.play_id) {
              url = url+"id="+$scope.play_id
          }
          $http({url:url,method: "GET"})
            .success(function (data, status, headers, config) {
              //if (data.length > 0) {
              //  $scope.play_id = data[data.length - 1].id
              //};
              var pre = 0;
              // loop all the markers
              $.each(data, function(i,item){
               if (pre < item.id) {
                  pre = item.id;
                  $scope.play_id = pre;
                }
                // add marker to map
               var t =  window.setTimeout(function() {
                    loadMarker(item,'play')
                }, i * 200);
               timers.push(t);
               $scope.count = timers.length
              });
              promise['play'] = $timeout(function(){$scope.loadMarkers.GetPlayViewData();}, 10000);
            }).error(function (data, status, headers, config) {
                console.log(data)
            });
        },
        GetAdsViewData: function(){
          /* call ajax call to get graph data
          ------------------------- */
          var url = "/api/map/ads/geography/wise?";
          if ($scope.ads_id) {
              url = url+"id="+$scope.ads_id
          }
          $http({url:url,method: "GET"})
            .success(function (data, status, headers, config) {
              //if (data.length > 0) {
              //  $scope.ads_id = data[data.length - 1].id
              //};
              var pre = 0;
              // loop all the markers
              $.each(data, function(i,item){
               if (pre < item.id) {
                  pre = item.id;
                  $scope.ads_id = pre;
                }
                // add marker to map
               var t =  window.setTimeout(function() {
                    loadMarker(item,'ads')
                }, i * 200);
               timers.push(t);
               $scope.count = timers.length
              });
              promise['ads'] = $timeout(function(){$scope.loadMarkers.GetAdsViewData();}, 10000);
            }).error(function (data, status, headers, config) {
                console.log(data)
            });
        },
        GetDealsViewData: function(){
          /* call ajax call to get graph data
          ------------------------- */
          var url = "/api/events/vudeal/geography/wise?";
          if ($scope.deals_id) {
              url = url+"id="+$scope.deals_id
          }
          $http({url:url,method: "GET"})
            .success(function (data, status, headers, config) {
              //if (data.length > 0) {
              //  $scope.deals_id = data[data.length - 1].id
              //};
              var pre = 0;
              // loop all the markers
              $.each(data, function(i,item){
               if (pre < item.id) {
                  pre = item.id;
                  $scope.deals_id = pre;
                }
                // add marker to map
               var t =  window.setTimeout(function() {
                    loadMarker(item,'deals')
                }, i * 200);
               timers.push(t);
               $scope.count = timers.length
              });
              promise['deals'] = $timeout(function(){$scope.loadMarkers.GetDealsViewData();}, 10000);
            }).error(function (data, status, headers, config) {
                console.log(data)
            });
        }          
      }
      /**
       * Show marker info window
       */
      function showMarker(markerId){
  
          // get marker information from marker list
          var marker = markerList[markerId];
          // check if marker was found
          if( marker ){
              // get marker detail information from server
              // $.get( 'data/' + marker.id + '.html' , function(data) 
              //     // show marker window
              //     infowindow.setContent(data);
              //     infowindow.open(mapDefault,marker);
              // });
              infowindow.setContent(marker.title);
              infowindow.open(mapDefault,marker);
          }else{
              alert('Error marker not found: ' + markerId);
          }
      }
      function initialize() {
          var mapOptions = {
              zoom: 12,
              // center: new google.maps.LatLng(-33.397, 145.644),
              center: new google.maps.LatLng(30.7164,76.7444),
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              disableDefaultUI: true,
          };
          mapDefault = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
          var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}];
          // set default style 
          mapDefault.setOptions({styles: cobaltStyles});
          $('#content').addClass('content-inverse-mode');
          // create new info window for marker detail pop-up
          infowindow = new google.maps.InfoWindow();
          // $scope.loadMarkers();
      }
      initialize();
      $scope.play_id = false;
      $scope.loadMarkers.GetPlayViewData();
      $('[data-map-activity]').click(function() {
          var targetTheme = $(this).attr('data-map-activity');
          var targetLi = $(this).closest('li');
          var targetText = $(this).text();
          var inverseContentMode = false;
          $('#map-activity-selection li').not(targetLi).removeClass('active');
          $('#map-activity-text').text(targetText);
          $(targetLi).addClass('active');
          var keys = Object.keys(promise);
          for (var i = 0; i < keys.length; i++) {
            $timeout.cancel(promise[keys[i]]);   
          }
        for (var i = 0; i < timers.length; i++) {
            window.clearTimeout(timers[i]);
          }
          initialize();
          var marker = Object.keys(markerList);
          for (var i = 0; i < marker.length; i++) {
            markerList[marker[i]].setMap(null);
          }
          switch(targetTheme) {
            case 'All':
              $scope.wallet_id = false;
              $scope.loadMarkers.GetNewWalletData();
              
              $scope.wallet_trans_id = false;
              $scope.loadMarkers.GetWalletTransactionData()
  
              $scope.play_id = false;
              $scope.loadMarkers.GetPlayViewData();
  
              $scope.ads_id = false;
              $scope.loadMarkers.GetAdsViewData();
  
              $scope.deals_id = false;
              $scope.loadMarkers.GetDealsViewData();
              break;
            case 'new-wallet':
              $scope.wallet_id = false;
              $scope.loadMarkers.GetNewWalletData();
              break;
            case 'wallet-transaction':
              $scope.wallet_trans_id = false;
              $scope.loadMarkers.GetWalletTransactionData()
              break;
            case 'play-view':
              $scope.play_id = false;
              $scope.loadMarkers.GetPlayViewData();
              break;
            case 'dau':
              break;
            case 'my-media-view':
              break;
            case 'campaing-view':
              break;
            case 'ads-view':
              $scope.ads_id = false;
              $scope.loadMarkers.GetAdsViewData();
              break;
            case 'deals-view':
              $scope.deals_id = false;
              $scope.loadMarkers.GetDealsViewData();
              break;  
            default:
              $scope.id = false;
              $scope.loadMarkers.GetNewWalletData();
              break;
          }
    });
      // $(window).unbind('googleMapLoaded');
      // $(window).bind('googleMapLoaded', initialize);
      // $.getScript("http://maps.google.com/maps/api/js?sensor=false&key=AIzaSyDceUuy_GNVbSgK16QNXKPR3pRVuxv4iB8&callback=handleGoogleMapLoaded");
      
      $(window).resize(function() {
          google.maps.event.trigger(mapDefault, "resize");
      });
      $scope.$on('$destroy',function(){
        //if(promise){
        //  $interval.cancel(promise);   
        //}
        var keys = Object.keys(promise);
        for (var i = 0; i < keys.length; i++) {
          $timeout.cancel(promise[keys[i]]);   
        }
      });
});