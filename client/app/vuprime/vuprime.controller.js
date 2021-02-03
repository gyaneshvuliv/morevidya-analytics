colorAdminApp.controller('vpregistrationLogsController', function ($scope, $rootScope, $state,$cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [ d.getFullYear(),pad(d.getMonth()+1), pad(d.getDate())].join('-');
    $scope.startDate =currentDate;
    $scope.endDate =currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - '+ currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy:        true,
            scrollX:        true,
            scrollCollapse: true,
            searching:     true,
            paging:         true,
            fixedColumns:   true,
            responsive:     false,
            select:         true,
            pagingType:     "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm',exportURL:'/api/vuprime/registration/export/csv'},
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm'},
            ],
            processing:     true,
            serverSide:     true,
            ajax: { 
                    url : "/api/vuprime/registration",
                    data : function(d){
                        d.startDate = $scope.startDate;
                        d.endDate = $scope.endDate;
                        d.access_token = $cookieStore.get('token');
                    },
                    complete: function(response) {
                        // console.log(response);
                   }
                },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
              }],    
            columns: [
                { data: "android_id",searchBy:true,
                  render: function (data) {
                        return data = '<a href="/app/vpreports/userpath?id=' + data + '">' + data + '</a>';
                    } 
                },
                // { data: "reg_id",searchBy:true },
                { data: "name",searchBy:true },
                { data: "age" },
                { data: "gender" },
                { data: "phone_no",searchBy:true},
                { data: "email_id",searchBy:true },
                { data: "sync_datetime",
                  render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    } 
                },
                { data: "model" },
                { data: "_interface",searchBy:true },
                { data: "latitude" },
                { data: "longitude" },
                { data: "partner",searchBy:true },
                { data: "reg_id",searchBy:true }
            ],
            drawCallback: function( settings ) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup( function (e) {
            if (e.keyCode == 13) {
                dautable.search(this.value).draw();
            }
        });
        /* Date Range Picker
        ------------------------- */
        $('#dau-data-daterange').daterangepicker({
            opens: 'right',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            startDate: moment(),
            endDate: moment(),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
                        'Last 7 Days': [moment().subtract( 6,'days'), moment()],
                        'Last 30 Days': [moment().subtract( 29,'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')]
                    },
        },
        function (start, end) {
            $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
            $scope.startDate = start.format('MMMM D, YYYY');
            $scope.endDate = end.format('MMMM D, YYYY');
            $scope.$apply();
            dautable.clear().draw();
        });
    };
});


colorAdminApp.controller('vptrackerLogsController', function ($scope,$interval, $rootScope,$http,$cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [ d.getFullYear(),pad(d.getMonth()+1), pad(d.getDate())].join('-');
    $scope.startDate =currentDate;
    $scope.endDate =currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - '+ currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy:        true,
            scrollX:        true,
            scrollCollapse: true,
            searching:     true,
            paging:         true,
            fixedColumns:   true,
            responsive:     false,
            select:         true,
            pagingType:     "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm',exportURL:'/api/vuprime/tracker/export/csv'},
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm'},
            ],
            processing:     true,
            serverSide:     true,
            ajax: { 
                    url : "/api/vuprime/tracker",
                    data : function(d){
                        d.startDate = $scope.startDate;
                        d.endDate = $scope.endDate;
                        d.access_token = $cookieStore.get('token');
                    },
                    complete: function(response) {
                        // console.log(response);
                   }
                },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
              }],    
            columns: [
                { data: "android_id",searchBy:true},
                { data: "name" },
                { data: "duration",
                  render: function (data) {
                        return (data/1000).toFixed(2);
                    } 
                },
                { data: "view_datetime",
                  render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    } 
                },
                { data: "type",searchBy:true },
                { data: "tracking_type" },
                { data: "model" },
                { data: "_interface" },
                { data: "partner",searchBy:true },                
                { data: "reg_id",searchBy:true}
                // { data: "session_id",searchBy:true}
            ],
            drawCallback: function( settings ) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup( function (e) {
            if (e.keyCode == 13) {
                dautable.search(this.value).draw();
            }
        });
        /* Date Range Picker
        ------------------------- */
        $('#dau-data-daterange').daterangepicker({
            opens: 'right',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            startDate: moment(),
            endDate: moment(),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                        'Today': [moment(), moment()],
                        'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
                        'Last 7 Days': [moment().subtract( 6,'days'), moment()],
                        'Last 30 Days': [moment().subtract( 29,'days'), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                        'Last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')]
                    },
        },
        function (start, end) {
            $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
            $scope.startDate = start.format('MMMM D, YYYY');
            $scope.endDate = end.format('MMMM D, YYYY');
            $scope.$apply();
            dautable.clear().draw();
        });
    };
    $scope.$on('CustomSearch', function (event, data) {
        // console.log(data); // 'Data to send'
        $scope.searchText= data;
        $scope.id = "";
        $scope.events = [];
        $scope.data_length = 0;
        $scope.getData();
    });
    $scope.data_length = 0;
    $scope.events = [];
    $scope.id = "";
    $scope.getData = function(){
        /* call ajax call to get graph data
        ------------------------- */
        var url="/api/vuscreen/play/real-time?";
        if ($scope.id) {
            url = url + "id="+$scope.id;
        }
        if ($scope.searchText) {
            url = url + "&device_id="+$scope.searchText;
        }
        $http({url:url ,method: "GET"})
            .success(function (data, status, headers, config) {
                for (var i = data.length - 1; i >= 0; i--) {
                    $scope.events.unshift(data[i])
                    $scope.data_length = $scope.data_length+1;
                };
                if (data.length > 0) {
                    $scope.id = data[0].id
                };

            }).error(function (data, status, headers, config) {
                console.log(data)
            });
    }
    var promise = $interval($scope.getData, 15000);
    $scope.$on('$destroy',function(){
        if(promise)
            $interval.cancel(promise);   
    });
    $scope.getData()
});


colorAdminApp.controller('vpfileplaysharehourwiseController', function($scope, $rootScope, $state,Auth, $location,$cookieStore,blackbox,$http) {   

    $scope.vpdateSelectorHourBand = 'Today'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate()-2);
    var startdate = moment(currentDate).format('YYYY-MM-DD').toString()//moment(d).format('YYYY-MM-DD').toString() //d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString() //moment(currentDate).format('YYYY-MM-DD').toString() //currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
    function loadChartData(data){
        var categories_VideoBucket = [];
        var series_VideoBucket = [];
        var previousRange = "";
        var previousDate = "";
        var rangeDateObject = {};
        $scope.server_count = 0;
        $scope.client_count = 0;
        for (var i = 0; i < data[0].length; i++) {
            if (previousRange == data[0][i].date || previousRange == "") {
                rangeDateObject[data[0][i].hourRange] = data[0][i].server;
                $scope.server_count +=  data[0][i].server;
                if (i == data[0].length-1) {
                    series_VideoBucket.push({name:data[0][i].date+" (Played)",dateObject :rangeDateObject});
                }
            }else{
                series_VideoBucket.push({name:previousRange+" (Played)",dateObject :rangeDateObject});
                rangeDateObject = {};
                rangeDateObject[data[0][i].hourRange] = data[0][i].server;
                $scope.server_count +=  data[0][i].server;
            }
            previousRange = data[0][i].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x]== data[0][i].hourRange) {
                    exist = true;
                }
            };
            if (exist == false) { categories_VideoBucket.push(data[0][i].hourRange) };
        };
        var previousRange1 = ""
        var rangeDateObject1 = {};
        for (var j = 0; j < data[1].length; j++) {
            if (previousRange1 == data[1][j].date || previousRange1 == "") {
                rangeDateObject1[data[1][j].hourRange] = data[1][j].client;
                $scope.client_count +=  data[1][j].client;
                if (j == data[1].length-1) {
                    series_VideoBucket.push({name:data[1][j].date+" (Duration)",dateObject :rangeDateObject1});
                }
            }else{
                series_VideoBucket.push({name:previousRange1+" (Duration)",dateObject :rangeDateObject1});
                rangeDateObject1 = {};
                rangeDateObject1[data[1][j].hourRange] = data[1][j].client;
                $scope.client_count +=  data[1][j].client;
            }
            previousRange1 = data[1][j].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x]== data[1][j].hourRange) {
                    exist = true;
                }
            };
            if (exist == false) { categories_VideoBucket.push(data[1][j].hourRange) };
        };
        categories_VideoBucket = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        //categories_VideoBucket = categories_VideoBucket.sort();
        for (var i = 0; i < series_VideoBucket.length; i++) {
            var data=[];
            var dateObject=series_VideoBucket[i].dateObject;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (dateObject[categories_VideoBucket[x]]) { data.push(dateObject[categories_VideoBucket[x]])}
                    else{data.push(0);}
            };
            var largest = Math.max.apply(Math, data);
            var index = data.indexOf(Math.max.apply(Math, data));
            data.splice(index, 1, { y : largest, dataLabels: {
                                            borderColor: 'red',
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            padding: 5,
                                            shadow: true,
                                            style: {
                                                fontWeight: 'bold'
                                            }
                                        }
            })
            series_VideoBucket[i].data=data;
        };
        $('#vpfile-playshare').highcharts({
            chart: {
                        type: 'line',
                        width: 960,
                        height: 400
                    },
            title: {
                text: '',
                x: -20 //center
            },
            xAxis: {
                categories: categories_VideoBucket,
                title: {
                    text: 'Hours'
                }
            },
            yAxis: {
                title: {
                    text: 'File Played/Duration'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}:00 Hours</span><br>',
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            if (this.y != 0) {
                              return this.y;
                            } else {
                              return null;
                            }
                        },
                        // borderRadius: 4,
                        // backgroundColor: 'rgba(252, 255, 197, 0.7)',
                        // borderWidth: 1,
                        // borderColor: '#AAA',
                        // y: -6
                    }
                }
            },
            series: series_VideoBucket,
            // exporting: {
            //     enabled: true
            // }
        });
    } 
    $scope.getData = function () {
        $scope.isLoading = true;
        var url = "/api/vuprime/fileplayshare/hourwise?startDate="+startdate+"&endDate="+enddate+"&daysfilter="+$scope.daysfilter+"&version="+$scope.version;
        $http.get(url)
            .then(function(response) {
                $scope.isLoading = false;
                if(response.data.length== 0){
                    $scope.select = "No record found."
                    loadChartData([]);
                }else{
                    loadChartData(response.data);
                }
        }); 

    };
    $('#vpfileplaysharehourWise').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    // 'Day Before Yesterday': [moment().subtract('days', 2), moment()],
                    'Last 3 Days': [moment().subtract('days', 2), moment()],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment(),
                endDate: moment()
            },
    //Filter data by date selected
        function(start, end,dateSelector) {
            $scope.vpdateSelectorHourBand = dateSelector;
            if (dateSelector == 'Custom Range') {$scope.vpdateSelectorHourBand=dateSelector +' '+ moment(new Date(start)).format('YYYY-MM-DD') +' to '+moment(new Date(end)).format('YYYY-MM-DD')};
            //startdate = new Date(start._d).getTime(); //start.format('YYYY-MM-DD').toString();
            //enddate = new Date(end._d).getTime(); // end.format('YYYY-MM-DD').toString();
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.getData();
    });
    $scope.getData();
});

colorAdminApp.controller('top10contentController', function($scope, $rootScope, $state,Auth, $location,$cookieStore,blackbox,$http) {
    $scope.topcontentdaterangeSelector = 'Last 7 Days'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate()-6);
    var startdate = moment(d).format('YYYY-MM-DD').toString() 
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString()
    // $scope.vehicle_no = ""
    $scope.create = function(){
        $scope.showme = true;
        var url = "/api/vuscreen/topcontent?vehicle_no="+$scope.vehicle_no+"&startDate="+startdate+"&endDate="+enddate
        $http.get(url)
        .then(function(response) {
            if(response.data.length > 0 ){
                $scope.showme = false;
                $scope.content = response.data
            }else{
                $scope.showme = false;
                alert("No Data to Display")
                $scope.content = []
            }
        });
    }
    $('#topcontent').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    // 'Day Before Yesterday': [moment().subtract('days', 2), moment()],
                    'Last 3 Days': [moment().subtract('days', 2), moment()],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 6),
                endDate: moment()
            },
    //Filter data by date selected
    function(start, end,dateSelector) {
            $scope.topcontentdaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') {$scope.topcontentdaterangeSelector=dateSelector +' '+ moment(new Date(start)).format('YYYY-MM-DD') +' to '+moment(new Date(end)).format('YYYY-MM-DD')};
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
    });
  // $scope.create();
})

colorAdminApp.controller('top10genreController', function($scope, $rootScope, $state,Auth, $location,$cookieStore,blackbox,$http) {
  $scope.topgenredaterangeSelector = 'Last 7 Days'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate()-6);
    var startdate = moment(d).format('YYYY-MM-DD').toString() 
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString() 
  $scope.create = function(){
    var url = "/api/vuscreen/topgenre?startDate="+startdate+"&endDate="+enddate
    $http.get(url)
        .then(function(response) {
            if(response.data.length > 0 ){
            $scope.genre = response.data
        }else{
          alert("No Data to Display")
      }
    });
  }
  $('#topgenre').daterangepicker(
            {
                ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                    // 'Day Before Yesterday': [moment().subtract('days', 2), moment()],
                    'Last 3 Days': [moment().subtract('days', 2), moment()],
                    'Last 7 Days': [moment().subtract('days', 6), moment()],
                    'Last 30 Days': [moment().subtract('days', 29), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
                },
                startDate: moment().subtract('days', 6),
                endDate: moment()
            },
  //Filter data by date selected
  function(start, end,dateSelector) {
            $scope.topgenredaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') {$scope.topgenredaterangeSelector=dateSelector +' '+ moment(new Date(start)).format('YYYY-MM-DD') +' to '+moment(new Date(end)).format('YYYY-MM-DD')};
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
  });
  $scope.create();
})

colorAdminApp.controller('busSummaryController', function($scope, $rootScope, $state, $http) {
    /* High Pie Chart Option
    ------------------------- */
    $scope.busdateRangeSelector = 'Last 7 Days'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate()-6);
    $scope.startDate = moment(d).format('YYYY-MM-DD').toString();
    $scope.endDate = moment(currentDate).format('YYYY-MM-DD').toString();
    $scope.interface;
    var chart ;
    var options = {
        chart: {
            type: 'pie',
            width: 960,
            height:400,
            renderTo: 'bus-pie-chart',
            events: {
                        drilldown: function (e) {
                            if (!e.seriesOptions && e.point.name != 'Other') {
                                //GetTheDrillDownData();;
                                chart.showLoading('Simulating Ajax ...');
                                var series = [{name: 'Summary',colorByPoint: true,data:[],keys:['Duration','UU','Views']}];
                                $http.get("/api/vuscreen/busSummary/" + e.point.name+"?startDate="+$scope.startDate+"&endDate="+$scope.endDate)
                                     .then(function(response){ 
                                            var arr = [];
                                            for(var i =0; i<response.data.length;i++){
                                                arr.push({name : response.data[i].title,y: response.data[i].count,x:response.data[i].uniqueviwers,z:response.data[i].views,Duration: response.data[i].count,UU: response.data[i].uniqueviwers,Views:response.data[i].views})
                                            }
                                            var data = {
                                                name: e.point.name,
                                                id: e.point.name,
                                                data: arr,
                                                }
                                            chart.hideLoading();
                                            // chart.setTitle({ text: drilldownTitle + e.point.a + "  " + e.point.name })
                                            chart.addSeriesAsDrilldown(e.point, data); 
                                    });
                            }
                        },
                        // drilldown: function(e) {
                        //     chart.setTitle({ text: drilldownTitle + e.point.name });
                        // },
                        drillup: function(e) {
                            // chart.setTitle({ text: defaultTitle });
                        }
                    }
        },
        title: {
            text: 'Bus Distribution ' + $scope.busdateRangeSelector
        },
        subtitle: {
            text: 'Click the slices to view others details.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    total : 0,
                    formatter: function() {
                        var pcnt = (this.y / this.total) * 100;
                        return this.point.name+':' + Highcharts.numberFormat(pcnt) + '%';
                    }
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span>',
            pointFormat: '<span style="color:{point.color}"> {point.name}</span>: <br/> <b>{point.y}</b> Minutes<br/><b>{point.x}</b> Unique Users<br/><b>{point.z}</b> Views<br/>'
        },
        series: [],
        exporting: {
                        enabled: true
                    } ,
        drilldown:{
                    series: [{
                        name: 'Other',
                        id: 'Other',
                        data: []
                    }]} 
    };
    $scope.getData = function(){
        /* call ajax call to get graph data
        ------------------------- */
        $http({url: "/api/vuscreen/busSummary?startDate="+$scope.startDate+"&endDate="+$scope.endDate,method: "GET"})
            .success(function (data, status, headers, config) {
                var series = [{name: 'Summary',colorByPoint: true,data:[],keys:['Duration','UU','Views']}];
                var drilldownData = [];
                var pre = 0;
                var uni = 0;
                $scope.total = 0;
                
                for (var i = 0; i < data.length; i++) {
                    if (i < 20) {
                        series[0].data.push({name: data[i].bus,y: data[i].count,x: data[i].uniqueviwers,z:data[i].views,Duration: data[i].count,UU: data[i].uniqueviwers,Views:data[i].views,drilldown: data[i].bus})
                        $scope.total = $scope.total + data[i].count;
                    }else{
                        pre = pre + data[i].count
                        uni = uni + data[i].uniqueviwers
                        $scope.total = $scope.total + data[i].count;
                        drilldownData.push({name: data[i].bus,y: data[i].count,x: data[i].uniqueviwers,z:data[i].views,Duration: data[i].count,UU: data[i].uniqueviwers,Views:data[i].views})
                        if (i==data.length-1) {
                            series[0].data.push({name: 'Other',y: pre,x:uni,drilldown: 'Other'})
                        }
                    }
                }
                // update Title 
                options.title.text = 'Bus Distribution ' + $scope.busdateRangeSelector
                // update the total value 
                options.plotOptions.series.dataLabels.total = $scope.total;
                // update the series data
                options.series = series;
                // update the drilldown data
                options.drilldown.series[0].data = drilldownData;
                // Create the chart
                chart = new Highcharts.Chart(options);
            }).error(function (data, status, headers, config) {
                // alert(data.success)
            });
    }
    $scope.getData()
    /* Date Range Picker
        ------------------------- */
    $('#bus-summary-daterange').daterangepicker({
        opens: 'right',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        startDate: moment().subtract(6,'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2022',
        ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
                    'Last 7 Days': [moment().subtract( 6,'days'), moment()],
                    'Last 30 Days': [moment().subtract( 29,'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')]
                },
    },
    function (start, end) {
        $scope.busdateRangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
        $scope.startDate = start.format('MMMM D, YYYY');
        $scope.endDate = end.format('MMMM D, YYYY');
        $scope.$apply();
        $scope.getData();
        // $scope.summaryDataTable.clear().draw();
    });
});

colorAdminApp.controller('genreSummaryController', function($scope, $rootScope, $state, $http) {
    /* High Pie Chart Option
    ------------------------- */
    $scope.genredateRangeSelector = 'Last 7 Days'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate()-6);
    $scope.startDate = moment(d).format('YYYY-MM-DD').toString();
    // $scope.endDate = moment(d).format('YYYY-MM-DD').toString();
    $scope.endDate = moment(currentDate).format('YYYY-MM-DD').toString()
    $scope.interface;
    var chart ;
    var options = {
        chart: {
            type: 'pie',
            width: 960,
            height:400,
            renderTo: 'genre-pie-chart',
            events: {
                        drilldown: function (e) {
                            if (!e.seriesOptions && e.point.name != 'Other') {
                                //GetTheDrillDownData();;
                                chart.showLoading('Simulating Ajax ...');
                                var series = [{name: 'Summary',colorByPoint: true,data:[],keys:['Duration','UU','Views']}];
                                $http.get("/api/vuscreen/genreSummary/" + e.point.name+"?startDate="+$scope.startDate+"&endDate="+$scope.endDate)
                                     .then(function(response){ 
                                            var arr = [];
                                            for(var i =0; i<response.data.length;i++){
                                                arr.push({name : response.data[i].title,y: response.data[i].count,x:response.data[i].uniqueviwers,z:response.data[i].views,Duration: response.data[i].count,UU: response.data[i].uniqueviwers,Views:response.data[i].views})
                                            }
                                            var data = {
                                                name: e.point.name,
                                                id: e.point.name,
                                                data: arr,
                                                }
                                            chart.hideLoading();
                                            // chart.setTitle({ text: drilldownTitle + e.point.a + "  " + e.point.name })
                                            chart.addSeriesAsDrilldown(e.point, data); 
                                    });
                            }
                        },
                        // drilldown: function(e) {
                        //     chart.setTitle({ text: drilldownTitle + e.point.name });
                        // },
                        drillup: function(e) {
                            // chart.setTitle({ text: defaultTitle });
                        }
                    }
        },
        title: {
            text: 'Genre Distribution ' + $scope.genredateRangeSelector
        },
        subtitle: {
            text: 'Click the slices to view others details.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    total : 0,
                    formatter: function() {
                        var pcnt = (this.y / this.total) * 100;
                        return this.point.name+':' + Highcharts.numberFormat(pcnt) + '%';
                    }
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span>',
            pointFormat: '<span style="color:{point.color}"> {point.name}</span>: <br/> <b>{point.y}</b> Minutes<br/><b>{point.x}</b> Unique Users<br/><b>{point.z}</b> Views<br/>'
        },
        series: [],
        exporting: {
                        enabled: true
                    } ,
        drilldown:{
                    series: [{
                        name: 'Other',
                        id: 'Other',
                        data: []
                    }]} 
    };
    $scope.getData = function(){
        /* call ajax call to get graph data
        ------------------------- */
        $http({url: "/api/vuscreen/genreSummary?startDate="+$scope.startDate+"&endDate="+$scope.endDate,method: "GET"})
            .success(function (data, status, headers, config) {
                var series = [{name: 'Summary',colorByPoint: true,data:[],keys:['Duration','UU','Views']}];
                var drilldownData = [];
                var pre = 0;
                var uni = 0;
                $scope.total = 0;
                
                for (var i = 0; i < data.length; i++) {
                    if (i < 20) {
                        series[0].data.push({name: data[i].genre,y: data[i].count,x: data[i].uniqueviwers,z:data[i].views,Duration: data[i].count,UU: data[i].uniqueviwers,Views:data[i].views,drilldown: data[i].genre})
                        $scope.total = $scope.total + data[i].count;
                    }else{
                        pre = pre + data[i].count
                        uni = uni + data[i].uniqueviwers
                        $scope.total = $scope.total + data[i].count;
                        drilldownData.push({name: data[i].genre,y: data[i].count,x: data[i].uniqueviwers,z:data[i].views,Duration: data[i].count,UU: data[i].uniqueviwers,Views:data[i].views})
                        if (i==data.length-1) {
                            series[0].data.push({name: 'Other',y: pre,x:uni,drilldown: 'Other'})
                        }
                    }
                }
                // update Title 
                options.title.text = 'Genre Distribution ' + $scope.genredateRangeSelector
                // update the total value 
                options.plotOptions.series.dataLabels.total = $scope.total;
                // update the series data
                options.series = series;
                // update the drilldown data
                options.drilldown.series[0].data = drilldownData;
                // Create the chart
                chart = new Highcharts.Chart(options);
            }).error(function (data, status, headers, config) {
                // alert(data.success)
            });
    }
    $scope.getData()
    /* Date Range Picker
        ------------------------- */
    $('#genre-summary-daterange').daterangepicker({
        opens: 'right',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        startDate: moment().subtract(6,'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2022',
        ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
                    'Last 7 Days': [moment().subtract( 6,'days'), moment()],
                    'Last 30 Days': [moment().subtract( 29,'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month')]
                },
    },
    function (start, end) {
        $scope.genredateRangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
        $scope.startDate = start.format('MMMM D, YYYY');
        $scope.endDate = end.format('MMMM D, YYYY');
        $scope.$apply();
        $scope.getData();
        // $scope.summaryDataTable.clear().draw();
    });
});

colorAdminApp.controller('userPathController', function ($scope,$state,$http,$location) {
    $http.get('/api/vuprime/userpath/'+$state.params.id).then(function(success) {
        var data = success.data
        // var mapOptions = {
        //     zoom: 7,
        //     center: new google.maps.LatLng(28.5057,77.0837),
        //     mapTypeId: google.maps.MapTypeId.ROADMAP,
        //     disableDefaultUI: true,
        //     gestureHandling: 'greedy'
        //   }
            
        //   $scope.map = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
        //   var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}];
        //   $scope.map.setOptions({styles: cobaltStyles});
        //   $scope.markers = [];
    
        //   var infoWindow = new google.maps.InfoWindow();
    
        //   var createMarker = function (info){
        //     var latLng = new google.maps.LatLng(info.latitude,
        //         info.longitude);
        //     var marker = new google.maps.Marker({'position': latLng});
        //     marker.content = '<div class="infoWindowContent">'+
        //                           '<div>'+
        //                               '<h5>'+ info.name+'</h5>'+
        //                               '<b>Phone No - '+ info.phone_no+'</b><br>'+  
        //                               '<b>Gender - '+ info.gender+'</b><br>'+
        //                               '<b>AGE - '+ info.age+'</b><br>'+
        //                               '<b>Android ID - '+ info.android_id+'</b><br>'+
        //                               '<b>interface - '+ info._interface+'</b><br>'+
        //                               '<b>Model - '+ info.model+'</b><br>'+
        //                               '<b>Sync Date - '+ moment(info.sync_datetime).format('YYYY-MM-DD, HH:mm:ss')+'</b><br>'+
        //                           '</div>'+
        //                       '</div>';
        //     google.maps.event.addListener(marker, 'click', function(){
        //         infoWindow.setContent(marker.content);
        //         infoWindow.open($scope.map, marker);
        //     });
            
        //     $scope.markers.push(marker);
            
        //   }  
    
        //   for (var i = 0; i < data.length; i++){
        //     createMarker(data[i]);
        //   }
        //   var markerCluster = new MarkerClusterer($scope.map, $scope.markers, {imagePath: '/app/map/images/m'});
          
        //   $scope.openInfoWindow = function(e, selectedMarker){
        //     e.preventDefault();
        //     google.maps.event.trigger(selectedMarker, 'click');
        //   }
        // This example adds an animated symbol to a polyline.

        // var map = new google.maps.Map(document.getElementById('map'), {
        //   center: {lat: 20.291, lng: 153.027},
        //   zoom: 6,
        //   mapTypeId: 'terrain'
        // });

        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(28.5057,77.0837),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            gestureHandling: 'greedy'
          }

        map = new google.maps.Map(document.getElementById('google-map-default'), mapOptions);
        var cobaltStyles  = [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":10},{"gamma":0.8},{"hue":"#293036"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#293036"}]}]; 
        map.setOptions({styles: cobaltStyles});
        var lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          strokeColor: '#393'
        };
        $scope.userCoor = [];
        $scope.userCoorPath = []
        for (let i = 0; i < data.length; i++) {
            $scope.userCoor.push(['<div class="infoWindowContent">'+
            '<div>'+
                '<h5>'+ data[i].name+'</h5>'+
                '<b>Phone No - '+ data[i].phone_no+'</b><br>'+  
                '<b>Gender - '+ data[i].gender+'</b><br>'+
                '<b>AGE - '+ data[i].age+'</b><br>'+
                '<b>Android ID - '+ data[i].android_id+'</b><br>'+
                '<b>interface - '+ data[i]._interface+'</b><br>'+
                '<b>Model - '+ data[i].model+'</b><br>'+
                '<b>Sync Date - '+ moment(data[i].sync_datetime).format('YYYY-MM-DD, HH:mm:ss')+'</b><br>'+
            '</div>'+
        '</div>',parseInt(data[i].latitude),parseInt(data[i].longitude)])
            $scope.userCoorPath.push(new google.maps.LatLng(parseInt(data[i].latitude),parseInt(data[i].longitude)))
        }
        var line = new google.maps.Polyline({
          map: map,
          path: $scope.userCoorPath,
          icons: [{
            icon: lineSymbol,
            offset: '100%'
          }]
        });
      animateCircle(line);
      function animateCircle(line) {
          var count = 0;
          window.setInterval(function() {
            count = (count + 1) % 200;
            var icons = line.get('icons');
            icons[0].offset = (count / 2) + '%';
            line.set('icons', icons);
        }, 100);
      }
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < $scope.userCoor.length; i++) {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.userCoor[i][1], $scope.userCoor[i][2]),
            draggable: true,
            map: map,
            // icon:"/assets/img/markers/default.png",
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            infowindow.setContent($scope.userCoor[i][0]);
            infowindow.open(map, marker);
            }
        })(marker, i));
        }
    });
});
