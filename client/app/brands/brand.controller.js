colorAdminApp.controller('adsBrandsLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                // { extend: 'csv', className: 'btn-sm', exportURL: '/api/vuscreen/registration/export/csv' },
                // { extend: 'pdf', className: 'btn-sm'},
                { extend: 'colvis', className: 'btn-sm' },
            ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "/api/brands/ads",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.type = $scope.type;
                    d.section = $scope.section;
                    d.status = $scope.status;
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
                // {
                //     data: "id", searchBy: true,
                //     render: function (data) {
                //         return data = '<a href="/app/json/editads?id=' + data + '">' + data + '</a>';
                //     }
                // },
                { data: "id", searchBy: true },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            let attrDisabled = 'disabled';
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.id + '" checked ' + attrDisabled +'>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.id + '">'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        }
                    }
                },
                {
                    data: "thumbnail",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "brand",searchBy:true },
                { data: "title", searchBy: true },
                { data: "format" },
                { data: "duration" },
                {
                    data: "pre",
                    render: function (data) {
                        if(data == "undefined") {return "-"} else {return data}
                    }
                },
                {
                    data: "mid",
                    render: function (data) {
                        if(data == "undefined") {return "-"} else {return data}
                    }
                },
                {
                    data: "banner",
                    render: function (data) {
                        if(data == "undefined") {return "-"} else {return data}
                    }
                },
                // { data: "pre" },
                // { data: "mid" },
                // { data: "banner" },
                {
                    data: "start_time",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                },
                {
                    data: "end_time",
                    render: function (data) {
                        return moment(data).format('YYYY-MM-DD, HH:mm:ss');//new Date(data);
                    }
                }
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
        $('#status').on("change", function () {
            $scope.status = this.value
            $scope.$apply();
            dautable.clear().draw();
        });
    };    
    
    $('#dau-data-data-table').on('click', 'input', function () {
        let status = $(this).data('name')
        let id = $(this).data('id')
        if (status) {
            status = 0
        } else {
            status = 1
        }
        let parameter = {
            id: id,
            status: status
        }
        $http.post('/api/brands/change-ads-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                alert("Somthing went wrong!")
            }
        });
    });
});
