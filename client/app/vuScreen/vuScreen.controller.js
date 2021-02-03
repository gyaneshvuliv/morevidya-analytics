/* -------------------------------
   39.0 CONTROLLER - Gallery V1
------------------------------- */
colorAdminApp.controller('galleryController', function ($scope, $rootScope, $state, $http) {

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
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        var container = $('.gallery');
        var dividerValue = calculateDivider();
        var containerWidth = $(container).width() - 20;
        var columnWidth = containerWidth / dividerValue;
        $(container).isotope({
            resizable: true,
            masonry: {
                columnWidth: columnWidth
            }
        });
        $(window).smartresize(function () {
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

        $optionLinks.click(function () {
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
            options[key] = value;
            $(container).isotope(options);
            return false;
        });
    });
    $http
        .get('/api/documents/screen')
        .success(function (doc) {
            $scope.docList = doc.data;
        }).error(function (err) {
            console.log(err);
        })


});

colorAdminApp.controller('documentController', function ($scope, $rootScope, $state, $http) {
    $http
        .get('/api/documents')
        .success(function (doc) {
            $scope.docList = doc.data;
        }).error(function (err) {
            console.log(err);
        })

});

colorAdminApp.controller('apkController', function ($scope, $rootScope, $state, $http) {
    // FormWizardValidation.init();
    $http
        .get('/api/documents/apk')
        .success(function (doc) {
            $scope.docList = doc.data;
        }).error(function (err) {
            console.log(err);
        })
});

colorAdminApp.controller('registrationLogsController', function ($scope, $rootScope, $state, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/registration/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/registration",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                {
                    data: "reg_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/reports/editregistration?id=' + data + '">' + data + '</a>';
                    }
                },
                // { data: "reg_id",searchBy:true },
                { data: "vehicle_no", searchBy: true },
                { data: "device_id", searchBy: true },
                {
                    data: "sync_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                },
                { data: "source" },
                { data: "destination" },
                { data: "seat_start", visible: false },
                { data: "seat_end", visible: false },
                { data: "model" },
                { data: "sdcard_name" },
                { data: "sdcard_no" },
                { data: "interface", visible: false },
                { data: "os_version", visible: false },
                { data: "owner_email" },
                { data: "owner_name" },
                { data: "owner_no" },
                { data: "driver_name" },
                { data: "driver_no" },
                { data: "helper_name" },
                { data: "helper_no" }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('eventsLogsController', function ($scope, $rootScope, $state, $cookieStore, $http) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    console.log(currentDate);
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate, endDate) {
        var url = "/api/vuscreen/event/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data[0]
                    console.log($scope.clicks);

                } else {
                    alert("No Data to Display")
                }
            });
    }
    $scope.create($scope.startDate, $scope.endDate)

    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pagingType: "full_numbers",
            pageLength: 100,
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/events/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/events",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                { data: "sync_date" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                },
                { data: "event", searchBy: true },
                { data: "journey_id" },
                { data: "unique_mac_address" },
                { data: "reg_id", visible: false, searchBy: true },
                { data: "device_id", visible: false, searchBy: true },
                { data: "user", visible: false, searchBy: true },
                { data: "sync_latitude", visible: false },
                { data: "sync_longitude", visible: false },
                { data: "model", visible: false },
                { data: "play_duration", visible: false },
                { data: "sync_type", visible: false },
                { data: "interface", visible: false, searchBy: true },
                { data: "version", visible: false, searchBy: true }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                dautable.clear().draw();
                $scope.create($scope.startDate, $scope.endDate)
            });
    };
});


colorAdminApp.controller('cabinCrewLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;

    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/cabincrew/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/cabinCrew",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                { data: "type", searchBy: true },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "sync_date", searchBy: true },


                { data: "user_agent" },
                { data: "sync_type", visible: false },
                { data: "mac", searchBy: true, visible: false },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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



colorAdminApp.controller('adsLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            pageLength: 100,
            responsive: false,
            select: true,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/ads/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/ads",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },

                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "sync_date", searchBy: true },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "play_duration", visible: false },
                { data: "user_agent" },
                { data: "sync_type", visible: false },

                // { data: "genre",searchBy:true },
                { data: "type", searchBy: true, visible: false },
                { data: "mac", searchBy: true, visible: false },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                // { data: "model" },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
                // { data: "session_id",searchBy:true}
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('gamesLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate, endDate) {
        var url = "/api/vuscreen/game/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data[0]
                    console.log($scope.clicks);

                } else {
                    alert("No Data to Display")
                }
            });
    }
    $scope.create($scope.startDate, $scope.endDate)
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/games/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/games",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "sync_date", searchBy: true },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "user_agent" },
                { data: "play_duration", visible: false },
                { data: "sync_type", visible: false },
                { data: "mac", searchBy: true, visible: false },
                // { data: "genre",searchBy:true },
                { data: "type", searchBy: true, visible: false },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                // { data: "model" },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                dautable.clear().draw();
                $scope.create($scope.startDate, $scope.endDate)
            });
    };
});

colorAdminApp.controller('readLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate, endDate) {
        var url = "/api/vuscreen/read/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data[0]
                    console.log($scope.clicks);

                } else {
                    alert("No Data to Display")
                }
            });
    }
    $scope.create($scope.startDate, $scope.endDate)
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/reads/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/reads",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "sync_date" },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "type", searchBy: true },
                { data: "user_agent" },
                { data: "mac", searchBy: true, visible: false },
                // { data: "genre",searchBy:true },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                // { data: "model" },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "play_duration", visible: false },
                { data: "sync_type", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                dautable.clear().draw();
                $scope.create($scope.startDate, $scope.endDate)
            });
    };
});

colorAdminApp.controller('travelLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/travels/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/travels",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "mac", searchBy: true, visible: false },
                // { data: "genre",searchBy:true },
                { data: "type", searchBy: true },
                { data: "device_id", searchBy: true, visible: false },
                { data: "source", visible: false },
                { data: "destination", visible: false },
                { data: "vehicle_no", searchBy: true },
                { data: "interface", visible: false },
                // { data: "model" },
                { data: "view_model", visible: false },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "play_duration" },
                { data: "sync_type" },
                { data: "reg_id", searchBy: true, visible: false },
                { data: "user_agent" }
                // { data: "session_id",searchBy:true}
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('mallsLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/malls/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/malls",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "mac", searchBy: true, visible: false },
                // { data: "genre",searchBy:true },
                { data: "type", searchBy: true },
                { data: "device_id", searchBy: true, visible: false },
                { data: "source", visible: false },
                { data: "destination", visible: false },
                { data: "vehicle_no", searchBy: true },
                { data: "interface", visible: false },
                // { data: "model" },
                { data: "view_model", visible: false },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "play_duration" },
                { data: "sync_type" },
                { data: "reg_id", searchBy: true, visible: false },
                { data: "user_agent" }
                // { data: "session_id",searchBy:true}
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('FnBLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate, endDate) {
        var url = "/api/vuscreen/fnb/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data[0]
                    console.log($scope.clicks);

                } else {
                    alert("No Data to Display")
                }
            });
    }
    $scope.create($scope.startDate, $scope.endDate)
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/fnb/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/fnb",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                { data: "sync_date", searchBy: true },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "type", searchBy: true },
                { data: "user_agent" },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "play_duration", visible: false },
                { data: "sync_type", visible: false },
                { data: "mac", searchBy: true, visible: false },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                { data: "trackingDetails", visible: false },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                dautable.clear().draw();
                $scope.create($scope.startDate, $scope.endDate)
            });
    };
});

colorAdminApp.controller('trackerLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate, endDate) {
        var url = "/api/vuscreen/play/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data[0]
                    console.log($scope.clicks);

                } else {
                    alert("No Data to Display")
                }
            });
    }
    $scope.create($scope.startDate, $scope.endDate)

    $scope.creates = function (startDate, endDate) {
        var url = "/api/vuscreen/play_duration/bottomdata?startDate=" + startDate + "&endDate=" + endDate
        $http.get(url)
            .then(function (response) {
                console.log(response);
                $scope.clickl = response.data
                console.log($scope.clickl);
            });
    }
    $scope.creates($scope.startDate, $scope.endDate)
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/tracker/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/tracker",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "vehicle_no", searchBy: true },
                { data: "source" },
                { data: "destination" },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "view_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "sync_date", searchBy: true },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "play_duration" },
                { data: "platform_duration" },
                { data: "user_agent" },
                { data: "sync_type", visible: false },
                { data: "genre", searchBy: true, visible: false },
                { data: "folder", visible: false },
                { data: "type", searchBy: true, visible: false },
                { data: "mac", searchBy: true, visible: false },
                { data: "device_id", searchBy: true, visible: false },
                { data: "interface", visible: false },
                { data: "view_model", visible: false },
                { data: "journey_id", visible: false },
                { data: "version", visible: false },
                { data: "view_android_id", visible: false },
                { data: "reg_id", searchBy: true, visible: false }
                // { data: "session_id",searchBy:true}
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.vuscreendaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                dautable.clear().draw();
                $scope.create($scope.startDate, $scope.endDate)
                $scope.creates($scope.startDate, $scope.endDate)
            });
    };
    $scope.$on('CustomSearch', function (event, data) {
        // console.log(data); // 'Data to send'
        $scope.searchText = data;
        $scope.id = "";
        $scope.events = [];
        $scope.data_length = 0;
        $scope.getData();
    });
    $scope.data_length = 0;
    $scope.events = [];
    $scope.id = "";
    $scope.getData = function () {
        /* call ajax call to get graph data
        ------------------------- */
        var url = "/api/vuscreen/play/real-time?";
        if ($scope.id) {
            url = url + "id=" + $scope.id;
        }
        if ($scope.searchText) {
            url = url + "&device_id=" + $scope.searchText;
        }
        $http({ url: url, method: "GET" })
            .success(function (data, status, headers, config) {
                for (var i = data.length - 1; i >= 0; i--) {
                    $scope.events.unshift(data[i])
                    $scope.data_length = $scope.data_length + 1;
                };
                if (data.length > 0) {
                    $scope.id = data[0].id
                };

            }).error(function (data, status, headers, config) {
                console.log(data)
            });
    }
    var promise = $interval($scope.getData, 15000);
    $scope.$on('$destroy', function () {
        if (promise)
            $interval.cancel(promise);
    });
    $scope.getData()
});

colorAdminApp.controller('temptrackerLogsController', function ($scope, $rootScope, $state, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/tracker1/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/tracker1",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "title" },
                {
                    data: "sync_datetime",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "mac", searchBy: true },
                { data: "genre", searchBy: true },
                { data: "type", searchBy: true },
                {
                    data: "view_duration",
                    render: function (data) {
                        return data.toFixed(2);
                    }
                },
                { data: "view_android_id" },
                { data: "session_id", searchBy: true }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days'),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('memorytrackerLogsController', function ($scope, $rootScope, $state, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.MemorydaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#memory-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var memorytable = $('#memory-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/memorytracker/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/memorytracker",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "android_id", searchBy: true },
                {
                    data: "sync_timestamp",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');
                    }
                },
                { data: "device_total_memory" },
                { data: "device_remaining_memory" },
                { data: "interface", searchBy: true },
                { data: "model" },
                { data: "version", searchBy: true },
                { data: "package" },
                { data: "reg_id", searchBy: true, visible: false }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
            if (e.keyCode == 13) {
                memorytable.search(this.value).draw();
            }
        });
        /* Date Range Picker
        ------------------------- */
        $('#memory-daterange').daterangepicker({
            opens: 'right',
            format: 'MM/DD/YYYY',
            separator: ' to ',
            startDate: moment(),
            endDate: moment(),
            minDate: '06/01/2017',
            maxDate: '12/31/2022',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        },
            function (start, end) {
                $scope.MemorydaterangeSelector = start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY');
                $scope.startDate = start.format('MMMM D, YYYY');
                $scope.endDate = end.format('MMMM D, YYYY');
                $scope.$apply();
                memorytable.clear().draw();
            });
    };
});

colorAdminApp.controller('ServerSessionLogsController', function ($scope, $rootScope, $state, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate() - 1)].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    if ($('#dau-data-data-table').length !== 0) {
        // alert($cookieStore.get('token'));
        var dautable = $('#dau-data-data-table').DataTable({
            dom: 'lBfrtip',
            // scrollY:        300,
            destroy: true,
            scrollX: true,
            scrollCollapse: true,
            searching: true,
            paging: true,
            fixedColumns: true,
            responsive: false,
            select: true,
            pageLength: 100,
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/server/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/vuscreen/server",
                data: function (d) {
                    d.startDate = $scope.startDate;
                    d.endDate = $scope.endDate;
                    d.access_token = $cookieStore.get('token');
                },
                complete: function (response) {
                    // console.log(response);
                }
            },
            columnDefs: [{
                "defaultContent": "-",
                "targets": "_all"
            }],
            columns: [
                { data: "session_id", searchBy: true },
                { data: "device_id", searchBy: true },
                {
                    data: "started_at",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                },
                {
                    data: "end_at",
                    render: function (data) {
                        if (data == null) {
                            data = ''
                            return data
                        } else {
                            return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                        }
                        //return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                },
                { data: "vehicle_no", searchBy: true },
                // { data: "partner" },
                { data: "source" },
                { data: "destination" },
                //{ data: "seat_start" },
                //{ data: "seat_end" },
                { data: "connected" },
                // { data: "client_disconnected" },
                { data: "videoPlayed" },
                { data: "total_duration" }
            ],
            drawCallback: function (settings) {
                //alert( 'DataTables has redrawn the table' );
            }
        });
        $('div.dataTables_filter input').unbind();
        $("div.dataTables_filter input").keyup(function (e) {
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
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('serverclientdaywiseController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.versions = [
        { version: '1.0.3' }, { version: '1.1.0' }, { version: '1.2.0' }, { version: '1.2.1' },
        { version: '1.3.0' }, { version: '1.3.1' }, { version: '1.3.2' }, { version: '1.3.3' },
        { version: '1.3.4' }, { version: '1.3.5' }, { version: '2.0.0' }, { version: '2.0.3' },
        { version: '2.1.0' }, { version: '2.1.1' }, { version: '2.2.0' }, { version: '2.3.0' },
        { version: '2.3.1' }, { version: '2.3.2' }, { version: '2.3.3' }, { version: '2.9.0' },
        { version: '3.0.0' }, { version: '3.0.1' }, { version: '3.0.2' }, { version: '4.0.0' },
        { version: '4.0.1' }, { version: '4.0.2' }, { version: '4.1.0' }, { version: '4.1.1' },
        { version: '4.1.2' }, { version: '5.0.0' }
    ]
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 6);
    var startdate = moment(d).format('YYYY-MM-DD').toString() //d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString();  //currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
    function loadChartData(data) {
        var day = []
        var categories = [];
        var ServerData = [];
        var ClientData = [];

        var datecat = []
        $scope.server_count = 0;
        $scope.client_count = 0;
        for (var i = 0; i < data[0].length; i++) {
            $scope.server_count += data[0][i].server
            ServerData.push(parseInt(data[0][i].server))
            categories.push(moment(data[0][i].date).format('DD MMM'));
            datecat.push(data[0][i].date);
            day.push(moment(data[0][i].date).format('ddd'))
        }
        for (var j = 0; j < datecat.length; j++) {
            var exist = false;
            for (var x = 0; x < data[1].length; x++) {
                if (datecat[j] == data[1][x].date) {
                    $scope.client_count += data[1][x].client
                    ClientData.push(parseInt(data[1][x].client))
                    exist = true;
                }
            };
            if (exist == false) {
                $scope.client_count += 0
                ClientData.push(0)
            };
        };

        //$scope.server_count = 0;
        //$scope.client_count = 0;
        //for (var i = 0; i < data[0].length; i++) {
        //    $scope.server_count += data[0][i].server
        //    ServerData.push(parseInt(data[0][i].server))
        //    categories.push(moment(data[0][i].date).format('DD MMM'));
        //    day.push(moment(data[0][i].date).format('ddd'))
        //}
        //for (var j = 0; j < data[1].length; j++) {
        //    $scope.client_count += data[1][j].client
        //    ClientData.push(parseInt(data[1][j].client));
        // }

        var largest = Math.max.apply(Math, ServerData);
        var index = ServerData.indexOf(Math.max.apply(Math, ServerData));
        ServerData.splice(index, 1, {
            y: largest, dataLabels: {
                borderColor: 'red',
                borderWidth: 2,
                padding: 5,
                shadow: true,
                style: {
                    fontWeight: 'bold'
                }
            }
        })
        $scope.cat_first_value = categories[0]
        var chart = new Highcharts.Chart({
            chart: {
                type: 'line',
                renderTo: 'mvp-day-bar',
                events: { load: function () { setTimeout(swapCats, 10000); } },
                width: 960,
                height: 400
            },
            title: {
                text: '',
                //x: -20 //center
            },
            /*subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },*/
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: 'Connections'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            if (this.y != 0) {
                                return this.y;
                            } else {
                                return null;
                            }
                        },
                        borderRadius: 4,
                        backgroundColor: 'rgba(252, 255, 197, 0.7)',
                        borderWidth: 1,
                        borderColor: '#AAA',
                        y: -6
                    }
                }
            },
            series: [{
                name: 'Servers',
                data: ServerData
            },
            {
                name: 'Clients',
                data: ClientData
            }]
        });
        // function to swap category
        function swapCats() {
            if (chart.xAxis[0].categories[0] == $scope.cat_first_value) {
                chart.xAxis[0].update({ categories: day }, true);
            } else {
                chart.xAxis[0].update({ categories: categories }, true);
            }
            setTimeout(swapCats, 10000);

        }
    }
    $scope.getData = function () {
        $scope.server_count = 0;
        $scope.interface1;
        var url = "/api/vuscreen/serverclient/datewise?interface='" + $scope.interface1 + "'&startDate=" + startdate + "&endDate=" + enddate + "&daysfilter=" + $scope.daysfilter + "&version=" + $scope.version;
        $http.get(url)
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.select = "No record found."
                    loadChartData([]);
                } else {
                    loadChartData(response.data);
                }

            });
    };
    $scope.mvpdateSelector = 'Last 7 Days'
    $('#mvpbardaywise').daterangepicker(
        {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
                // 'Last 3 Days': [moment().subtract('days', 2), moment()],
                'Last 7 Days': [moment().subtract('days', 6), moment()],
                'Last 30 Days': [moment().subtract('days', 29), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            startDate: moment().subtract('days', 6),
            endDate: moment()
        },
        //Filter data by date selected
        function (start, end, dateSelector) {
            $scope.mvpdateSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.mvpdateSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            //startdate = new Date(start._d).getTime(); //start.format('YYYY-MM-DD').toString();
            //enddate = new Date(end._d).getTime(); // end.format('YYYY-MM-DD').toString();
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.getData();
        });
    $scope.getData();
});

colorAdminApp.controller('serverclienthourwiseController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {

    $scope.dateSelectorHourBand = 'Today'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 2);
    var startdate = moment(currentDate).format('YYYY-MM-DD').toString()//moment(d).format('YYYY-MM-DD').toString() //d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString()//moment(currentDate).format('YYYY-MM-DD').toString() //currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
    function loadChartData(data) {
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
                $scope.server_count += data[0][i].server;
                if (i == data[0].length - 1) {
                    series_VideoBucket.push({ name: data[0][i].date + " (Server)", dateObject: rangeDateObject });
                }
            } else {
                series_VideoBucket.push({ name: previousRange + " (Server)", dateObject: rangeDateObject });
                rangeDateObject = {};
                rangeDateObject[data[0][i].hourRange] = data[0][i].server;
                $scope.server_count += data[0][i].server;
            }
            previousRange = data[0][i].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x] == data[0][i].hourRange) {
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
                $scope.client_count += data[1][j].client;
                if (j == data[1].length - 1) {
                    series_VideoBucket.push({ name: data[1][j].date + " (Client)", dateObject: rangeDateObject1 });
                }
            } else {
                series_VideoBucket.push({ name: previousRange1 + " (Client)", dateObject: rangeDateObject1 });
                rangeDateObject1 = {};
                rangeDateObject1[data[1][j].hourRange] = data[1][j].client;
                $scope.client_count += data[1][j].client;
            }
            previousRange1 = data[1][j].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x] == data[1][j].hourRange) {
                    exist = true;
                }
            };
            if (exist == false) { categories_VideoBucket.push(data[1][j].hourRange) };
        };
        categories_VideoBucket = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        //categories_VideoBucket = categories_VideoBucket.sort();
        for (var i = 0; i < series_VideoBucket.length; i++) {
            var data = [];
            var dateObject = series_VideoBucket[i].dateObject;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (dateObject[categories_VideoBucket[x]]) { data.push(dateObject[categories_VideoBucket[x]]) }
                else { data.push(0); }
            };
            var largest = Math.max.apply(Math, data);
            var index = data.indexOf(Math.max.apply(Math, data));
            data.splice(index, 1, {
                y: largest, dataLabels: {
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
            series_VideoBucket[i].data = data;
        };
        $('#events-cat').highcharts({
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
                    text: 'Connections'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}:00 Hours</span><br>',
                pointFormat: '{series.name}: <b>{point.y} Connection</b>'
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
                        formatter: function () {
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
        var url = "/api/vuscreen/serverclient/hourwise?startDate=" + startdate + "&endDate=" + enddate + "&daysfilter=" + $scope.daysfilter + "&version=" + $scope.version;
        $http.get(url)
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.select = "No record found."
                    loadChartData([]);
                } else {
                    loadChartData(response.data);
                }
            });

    };
    $('#eventcathourWise').daterangepicker(
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
        function (start, end, dateSelector) {
            $scope.dateSelectorHourBand = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.dateSelectorHourBand = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            //startdate = new Date(start._d).getTime(); //start.format('YYYY-MM-DD').toString();
            //enddate = new Date(end._d).getTime(); // end.format('YYYY-MM-DD').toString();
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.getData();
        });
    $scope.getData();
});

colorAdminApp.controller('fileplaysharehourwiseController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {

    $scope.dateSelectorHourBand = 'Today'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 2);
    var startdate = moment(currentDate).format('YYYY-MM-DD').toString()//moment(d).format('YYYY-MM-DD').toString() //d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    var enddate = moment(currentDate).format('YYYY-MM-DD').toString() //moment(currentDate).format('YYYY-MM-DD').toString() //currentDate.getFullYear()+'-'+(currentDate.getMonth()+1)+'-'+currentDate.getDate();
    function loadChartData(data) {
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
                $scope.server_count += data[0][i].server;
                if (i == data[0].length - 1) {
                    series_VideoBucket.push({ name: data[0][i].date + " (Played)", dateObject: rangeDateObject });
                }
            } else {
                series_VideoBucket.push({ name: previousRange + " (Played)", dateObject: rangeDateObject });
                rangeDateObject = {};
                rangeDateObject[data[0][i].hourRange] = data[0][i].server;
                $scope.server_count += data[0][i].server;
            }
            previousRange = data[0][i].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x] == data[0][i].hourRange) {
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
                $scope.client_count += data[1][j].client;
                if (j == data[1].length - 1) {
                    series_VideoBucket.push({ name: data[1][j].date + " (Duration)", dateObject: rangeDateObject1 });
                }
            } else {
                series_VideoBucket.push({ name: previousRange1 + " (Duration)", dateObject: rangeDateObject1 });
                rangeDateObject1 = {};
                rangeDateObject1[data[1][j].hourRange] = data[1][j].client;
                $scope.client_count += data[1][j].client;
            }
            previousRange1 = data[1][j].date;
            var exist = false;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (categories_VideoBucket[x] == data[1][j].hourRange) {
                    exist = true;
                }
            };
            if (exist == false) { categories_VideoBucket.push(data[1][j].hourRange) };
        };
        categories_VideoBucket = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        //categories_VideoBucket = categories_VideoBucket.sort();
        for (var i = 0; i < series_VideoBucket.length; i++) {
            var data = [];
            var dateObject = series_VideoBucket[i].dateObject;
            for (var x = 0; x < categories_VideoBucket.length; x++) {
                if (dateObject[categories_VideoBucket[x]]) { data.push(dateObject[categories_VideoBucket[x]]) }
                else { data.push(0); }
            };
            var largest = Math.max.apply(Math, data);
            var index = data.indexOf(Math.max.apply(Math, data));
            data.splice(index, 1, {
                y: largest, dataLabels: {
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
            series_VideoBucket[i].data = data;
        };
        $('#file-playshare').highcharts({
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
                        formatter: function () {
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
        var url = "/api/vuscreen/fileplayshare/hourwise?startDate=" + startdate + "&endDate=" + enddate + "&daysfilter=" + $scope.daysfilter + "&version=" + $scope.version;
        $http.get(url)
            .then(function (response) {
                $scope.isLoading = false;
                if (response.data.length == 0) {
                    $scope.select = "No record found."
                    loadChartData([]);
                } else {
                    loadChartData(response.data);
                }
            });

    };
    $('#fileplaysharehourWise').daterangepicker(
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
        function (start, end, dateSelector) {
            $scope.dateSelectorHourBand = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.dateSelectorHourBand = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            //startdate = new Date(start._d).getTime(); //start.format('YYYY-MM-DD').toString();
            //enddate = new Date(end._d).getTime(); // end.format('YYYY-MM-DD').toString();
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.getData();
        });
    $scope.getData();
});

colorAdminApp.controller('topclicksController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.topgenredaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    $scope.create = function () {
        var url = "/api/vuscreen/topclicks?startDate=" + startdate + "&endDate=" + enddate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data
                } else {
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
        function (start, end, dateSelector) {
            $scope.topgenredaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.topgenredaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    $scope.create();
})

colorAdminApp.controller('topclicksbyhostsController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.topgenredaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    $scope.create = function () {
        var url = "/api/vuscreen/topclicksbyhosts?startDate=" + startdate + "&endDate=" + enddate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.clicks = response.data
                } else {
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
        function (start, end, dateSelector) {
            $scope.topgenredaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.topgenredaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    $scope.create();
})

colorAdminApp.controller('top10contentController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.topcontentdaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    // $scope.vehicle_no = ""
    $scope.create = function () {
        $scope.showme = true;
        var url = "/api/vuscreen/topcontent?vehicle_no=" + $scope.vehicle_no + "&startDate=" + startdate + "&endDate=" + enddate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.showme = false;
                    $scope.content = response.data
                } else {
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
        function (start, end, dateSelector) {
            $scope.topcontentdaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.topcontentdaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    // $scope.create();
})

colorAdminApp.controller('top10genreController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.topgenredaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    $scope.create = function () {
        var url = "/api/vuscreen/topgenre?startDate=" + startdate + "&endDate=" + enddate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.genre = response.data
                } else {
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
        function (start, end, dateSelector) {
            $scope.topgenredaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.topgenredaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    $scope.create();
})

colorAdminApp.controller('busSummaryController', function ($scope, $rootScope, $state, $http) {
    /* High Pie Chart Option
    ------------------------- */
    $scope.busdateRangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    $scope.startDate = moment(d).format('YYYY-MM-DD').toString();
    $scope.endDate = moment(d).format('YYYY-MM-DD').toString();
    $scope.interface;
    var chart;
    var options = {
        chart: {
            type: 'pie',
            width: 960,
            height: 400,
            renderTo: 'bus-pie-chart',
            events: {
                drilldown: function (e) {
                    if (!e.seriesOptions && e.point.name != 'Other') {
                        //GetTheDrillDownData();;
                        chart.showLoading('Simulating Ajax ...');
                        var series = [{ name: 'Summary', colorByPoint: true, data: [], keys: ['Duration', 'UU', 'Views'] }];
                        $http.get("/api/vuscreen/busSummary/" + e.point.name + "?startDate=" + $scope.startDate + "&endDate=" + $scope.endDate)
                            .then(function (response) {
                                var arr = [];
                                for (var i = 0; i < response.data.length; i++) {
                                    arr.push({ name: response.data[i].title, y: response.data[i].count, x: response.data[i].uniqueviwers, z: response.data[i].views, Duration: response.data[i].count, UU: response.data[i].uniqueviwers, Views: response.data[i].views })
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
                drillup: function (e) {
                    // chart.setTitle({ text: defaultTitle });
                }
            }
        },
        title: {
            text: 'Aircraft Distribution ' + $scope.busdateRangeSelector
        },
        subtitle: {
            text: 'Click the slices to view others details.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    total: 0,
                    formatter: function () {
                        var pcnt = (this.y / this.total) * 100;
                        return this.point.name + ':' + Highcharts.numberFormat(pcnt) + '%';
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
        },
        drilldown: {
            series: [{
                name: 'Other',
                id: 'Other',
                data: []
            }]
        }
    };
    $scope.getData = function () {
        /* call ajax call to get graph data
        ------------------------- */
        $http({ url: "/api/vuscreen/busSummary?startDate=" + $scope.startDate + "&endDate=" + $scope.endDate, method: "GET" })
            .success(function (data, status, headers, config) {
                var series = [{ name: 'Summary', colorByPoint: true, data: [], keys: ['Duration', 'UU', 'Views'] }];
                var drilldownData = [];
                var pre = 0;
                var uni = 0;
                $scope.total = 0;

                for (var i = 0; i < data.length; i++) {
                    if (i < 20) {
                        series[0].data.push({ name: data[i].bus, y: data[i].count, x: data[i].uniqueviwers, z: data[i].views, Duration: data[i].count, UU: data[i].uniqueviwers, Views: data[i].views, drilldown: data[i].bus })
                        $scope.total = $scope.total + data[i].count;
                    } else {
                        pre = pre + data[i].count
                        uni = uni + data[i].uniqueviwers
                        $scope.total = $scope.total + data[i].count;
                        drilldownData.push({ name: data[i].bus, y: data[i].count, x: data[i].uniqueviwers, z: data[i].views, Duration: data[i].count, UU: data[i].uniqueviwers, Views: data[i].views })
                        if (i == data.length - 1) {
                            series[0].data.push({ name: 'Other', y: pre, x: uni, drilldown: 'Other' })
                        }
                    }
                }
                // update Title 
                options.title.text = 'Aircraft Distribution ' + $scope.busdateRangeSelector
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
        startDate: moment().subtract(6, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2022',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('genreSummaryController', function ($scope, $rootScope, $state, $http) {
    /* High Pie Chart Option
    ------------------------- */
    $scope.genredateRangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    $scope.startDate = moment(d).format('YYYY-MM-DD').toString();
    // $scope.endDate = moment(d).format('YYYY-MM-DD').toString();
    $scope.endDate = moment(d).format('YYYY-MM-DD').toString()
    $scope.interface;
    var chart;
    var options = {
        chart: {
            type: 'pie',
            width: 960,
            height: 400,
            renderTo: 'genre-pie-chart',
            events: {
                drilldown: function (e) {
                    if (!e.seriesOptions && e.point.name != 'Other') {
                        //GetTheDrillDownData();;
                        chart.showLoading('Simulating Ajax ...');
                        var series = [{ name: 'Summary', colorByPoint: true, data: [], keys: ['Duration', 'UU', 'Views'] }];
                        $http.get("/api/vuscreen/genreSummary/" + e.point.name + "?startDate=" + $scope.startDate + "&endDate=" + $scope.endDate)
                            .then(function (response) {
                                var arr = [];
                                for (var i = 0; i < response.data.length; i++) {
                                    arr.push({ name: response.data[i].title, y: response.data[i].count, x: response.data[i].uniqueviwers, z: response.data[i].views, Duration: response.data[i].count, UU: response.data[i].uniqueviwers, Views: response.data[i].views })
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
                drillup: function (e) {
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
                    total: 0,
                    formatter: function () {
                        var pcnt = (this.y / this.total) * 100;
                        return this.point.name + ':' + Highcharts.numberFormat(pcnt) + '%';
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
        },
        drilldown: {
            series: [{
                name: 'Other',
                id: 'Other',
                data: []
            }]
        }
    };
    $scope.getData = function () {
        /* call ajax call to get graph data
        ------------------------- */
        $http({ url: "/api/vuscreen/genreSummary?startDate=" + $scope.startDate + "&endDate=" + $scope.endDate, method: "GET" })
            .success(function (data, status, headers, config) {
                var series = [{ name: 'Summary', colorByPoint: true, data: [], keys: ['Duration', 'UU', 'Views'] }];
                var drilldownData = [];
                var pre = 0;
                var uni = 0;
                $scope.total = 0;

                for (var i = 0; i < data.length; i++) {
                    if (i < 20) {
                        series[0].data.push({ name: data[i].genre, y: data[i].count, x: data[i].uniqueviwers, z: data[i].views, Duration: data[i].count, UU: data[i].uniqueviwers, Views: data[i].views, drilldown: data[i].genre })
                        $scope.total = $scope.total + data[i].count;
                    } else {
                        pre = pre + data[i].count
                        uni = uni + data[i].uniqueviwers
                        $scope.total = $scope.total + data[i].count;
                        drilldownData.push({ name: data[i].genre, y: data[i].count, x: data[i].uniqueviwers, z: data[i].views, Duration: data[i].count, UU: data[i].uniqueviwers, Views: data[i].views })
                        if (i == data.length - 1) {
                            series[0].data.push({ name: 'Other', y: pre, x: uni, drilldown: 'Other' })
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
        startDate: moment().subtract(6, 'days'),
        endDate: moment(),
        minDate: '01/01/2012',
        maxDate: '12/31/2022',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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

colorAdminApp.controller('leaderboardController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.leaderboarddaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    $scope.create = function () {
        var url = "/api/vuscreen/leaderboard?startDate=" + startdate + "&endDate=" + enddate
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.leaderboard = response.data
                } else {
                    alert("No Data to Display")
                }
            });
    }
    $('#leaderboard').daterangepicker(
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
            startDate: moment().subtract('days', 1),
            // endDate: moment()
            endDate: moment().subtract(1, 'days'),
        },
        //Filter data by date selected
        function (start, end, dateSelector) {
            $scope.leaderboarddaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.leaderboarddaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    $scope.create();
})

colorAdminApp.controller('editRegController', function ($scope, $state, $http, $location) {
    $http.get('/api/vuscreen/get-partner-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.partner = $scope.data[0].partner
        $scope.device_id = $scope.data[0].device_id
        $scope.model = $scope.data[0].model
        $scope.os_version = $scope.data[0].os_version
        $scope.sdcard_name = $scope.data[0].sdcard_name
        $scope.sdcard_no = $scope.data[0].sdcard_no
        $scope.vehicle_no = $scope.data[0].vehicle_no
        $scope.source = $scope.data[0].source
        $scope.destination = $scope.data[0].destination
        $scope.owner_email = $scope.data[0].owner_email
        $scope.owner_name = $scope.data[0].owner_name
        $scope.owner_no = $scope.data[0].owner_no
        $scope.driver_name = $scope.data[0].driver_name
        $scope.driver_no = $scope.data[0].driver_no
        $scope.helper_name = $scope.data[0].helper_name
        $scope.helper_no = $scope.data[0].helper_no,
            $scope.location = $scope.data[0].location
    });
    $scope.save = function () {
        $http.get('/api/vuscreen/send-sms?number=' + $scope.driver_no)
            .success(function (data) {
                var retVal = prompt("Enter your otp : ", "your otp here");
                if (data.secureVal == retVal) {
                    var parameter = {
                        reg_id: $scope.$state.params.id,
                        partner: $scope.partner,
                        device_id: $scope.device_id,
                        model: $scope.model,
                        os_version: $scope.os_version,
                        sdcard_name: $scope.sdcard_name,
                        sdcard_no: $scope.sdcard_no,
                        vehicle_no: $scope.vehicle_no,
                        source: $scope.source,
                        destination: $scope.destination,
                        owner_email: $scope.owner_email,
                        owner_name: $scope.owner_name,
                        owner_no: $scope.owner_no,
                        driver_name: $scope.driver_name,
                        driver_no: $scope.driver_no,
                        helper_name: $scope.helper_name,
                        helper_no: $scope.helper_no,
                        location: $scope.location
                    }
                    $http.post('/api/vuscreen/edit-registration', parameter).then(function (success) {
                        $scope.data = success;
                        if ($scope.data.status == 200) {
                            $location.path('/success');
                        } else {
                            $location.path('/error');
                        }
                    });
                } else {
                    alert("Wrong OTP! Please Try Again")
                }
            })
            .error(function (data) {
                alert('Error: ' + data);
                console.log('Error: ' + data);
            });
    };
});

colorAdminApp.controller('monthlyusageController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.showme = true;
    $scope.create = function () {
        var url = "/api/vuscreen/monthlyusage"
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.showme = false;
                    $scope.usage = response.data
                } else {
                    alert("No Data to Display")
                    $scope.showme = false;
                }
            });
    }
    $scope.create()
})


colorAdminApp.controller('usagebucketController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.showme = true;
    $scope.create = function () {
        var url = "/api/vuscreen/usage-bucket"
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.showme = false;
                    $scope.usage = response.data
                } else {
                    alert("No Data to Display")
                    $scope.showme = false;
                }
            });
    }
    $scope.create()
})

colorAdminApp.controller('serverSessionController', function ($scope, $rootScope, $state, Auth, $location, $cookieStore, blackbox, $http) {
    $scope.topgenredaterangeSelector = 'Yesterday'
    var currentDate = new Date();
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var startdate = moment(d).format('YYYY-MM-DD').toString()
    var enddate = moment(d).format('YYYY-MM-DD').toString()
    $scope.showme = true;
    $scope.hostId = "";
    $(".searchId").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Do something
            $scope.create($scope.hostId)
        }
    });
    $scope.create = function (hostId) {
        $scope.showme = true;
        var url = "/api/vuscreen/server-session?startDate=" + startdate + "&endDate=" + enddate + "&hostId=" + hostId
        $http.get(url)
            .then(function (response) {
                if (response.data.length > 0) {
                    $scope.showme = false;
                    $scope.serversession = response.data
                    $scope.hostId = "";
                } else {
                    alert("No Data to Display")
                    $scope.serversession = []
                    $scope.hostId = "";
                    $scope.showme = false;
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
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days')
        },
        //Filter data by date selected
        function (start, end, dateSelector) {
            $scope.topgenredaterangeSelector = dateSelector;
            if (dateSelector == 'Custom Range') { $scope.topgenredaterangeSelector = dateSelector + ' ' + moment(new Date(start)).format('YYYY-MM-DD') + ' to ' + moment(new Date(end)).format('YYYY-MM-DD') };
            startdate = start.format('YYYY-MM-DD').toString();
            enddate = end.format('YYYY-MM-DD').toString();
            $scope.create();
        });
    $scope.create();
    $scope.downloadFile = function (data, filename = 'serverSession') {
        let csvData = ConvertToCSV(data, ['sync_date', 'HostID', 'cycle', 'wifiLogin', 'start_date', 'start_time', 
        'stop_date', 'stop_time', 'start_battery', 'stop_battery', 'start_stop_duration', 'battery_consumed']);
        let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
            dwldLink.setAttribute("target", "_blank");
        }
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", filename + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
    }
})

function ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
        row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i + 1) + '';
        for (let index in headerList) {
            let head = headerList[index];
            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
}


colorAdminApp.controller('realtimeController', function ($scope, $http, $rootScope, $state, $cookieStore) {
    $scope.searchinAll = function () {
        $scope.$broadcast('CustomSearch', $scope.searchText);
    }
})