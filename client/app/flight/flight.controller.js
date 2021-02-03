colorAdminApp.controller('flightTrackingController', function ($scope, $interval, $rootScope, $http, $cookieStore) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date();
    var currentDate = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    $scope.startDate = currentDate;
    $scope.endDate = currentDate;
    $scope.vuscreendaterangeSelector = currentDate + ' - ' + currentDate;
    $scope.create = function (startDate,endDate) { 
        var url = "/api/flight/tracking/bottom?startDate=" + startDate + "&endDate=" + endDate 
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
    $scope.create($scope.startDate,$scope.endDate)
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
                { extend: 'csv', className: 'btn-sm', exportURL: '/api/flight/tracking/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/flight/tracking",
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
                { data: "name" },
                { data: "mobile_no", searchBy: true },
                { data: "sync_datetime" },
                { data: "base_station", searchBy: true },
                { data: "source" },
                { data: "destination" },
                { data: "f_no", searchBy: true },
                { data: "host1", searchBy: true },
                { data: "host2", searchBy: true },
                { data: "remote", searchBy: true },
                { data: "f_type", searchBy: true } ,
                { data: "air_craft_type", searchBy: true},
                { data: "ftime"}
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
                $scope.create($scope.startDate,$scope.endDate)
            });
    };
});