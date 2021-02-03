colorAdminApp.controller('tambolaLogsController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
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
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/tambola/tambola/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/tambola/tambola",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
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
                { data: "gameName" },
                { data: "hostID", searchBy: true},
                { data: "gameStartTime" },
                { data: "gameEndTime"},
                { data: "registerUser"},
                { data: "gameId", searchBy: true },
                { data: "eventId"}
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

colorAdminApp.controller('tambolaPlayersController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
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
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/tambola/tambola-players/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/tambola/tambola-players",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
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
                { data: "playerId" },
                { data: "gameId", searchBy: true},
                { data: "name", searchBy: true },
                { data: "mobile"},
                { data: "seatNo"},
                { data: "macId" },
                { data: "score"},
                { data: "prizeId"},
                { data: "prizeName"}
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

colorAdminApp.controller('tambolaWinnersController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
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
            pagingType: "full_numbers",
            buttons: [
                // { extend: 'copy', className: 'btn-sm'},
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/tambola/tambola-winners/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/tambola/tambola-winners",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
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
                { data: "winnerId" },
                { data: "gameId", searchBy: true},
                { data: "name", searchBy: true },
                { data: "mobile"},
                { data: "seatNo"},
                { data: "macId" },
                { data: "score"},
                { data: "prizeId"},
                { data: "prizeName"}
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