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

colorAdminApp.controller('jsonLogsController', function ($scope, $http, $rootScope, $window, $location, $state, $cookieStore) {
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
                url: "/api/json/",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.status = $scope.status;
                    d.folder_id = $scope.folder_id;
                    d.category_id = $scope.category_id;
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
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editjson?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "folder_id" },
                { data: "description", visible: false },
                { data: "genre", searchBy: true },
                { data: "type" },
                { data: "duration" },
                { data: "position" },
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
                },
                { data: "language", searchBy: true },
                // { data: "rating", visible: false },
                // { data: "cast", visible: false },
                // { data: "release_date", visible: false },
                // { data: "country", visible: false },
                // { data: "is_ad", visible: false },
                // { data: "midroll_duration", visible: false },
                { data: "folder_name", visible: false },
                { data: "folder_view", visible: false },
                // { data: "folder_position", visible: false },
                { data: "cat_id", visible: false },
                { data: "cat_name", visible: false },
                { data: "cat_view", visible: false },
                // { data: "cat_position", visible: false },
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            let categoryId = [];
            if ($scope.category) {
                for (let i = 0; i < $scope.category.length; i++) {
                    const element = $scope.category[i].id;
                    categoryId.push(element)
                }
                $scope.category_id = categoryId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getCategoryList = function () {
        var url = "/api/json/category-list";
        $http.get(url)
            .then(function (response) {
                $scope.categorylist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.categorylist.push({ "id": $scope.data[index].id, "category": $scope.data[index].category });
                }
            });
    };
    $scope.getFolderList()
    $scope.getCategoryList()
    $('#dau-data-data-table').on('click', 'input', function () {
        let status = $(this).data('name')
        let content_id = $(this).data('id')
        if (status) {
            status = 0
        } else {
            status = 1
        }
        let parameter = {
            content_id: content_id,
            status: status
        }
        $http.post('/api/json/change-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/addjson";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editJsonController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-json-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.genre = $scope.data[0].genre
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.duration = $scope.data[0].duration
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.language = $scope.data[0].language
    });
    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            genre: $scope.genre,
            type: $scope.type,
            position: $scope.position,
            duration: $scope.duration,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            language: $scope.language
        }
        $http.post('/api/json/edit-json', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $location.path('/complete');
            } else {
                $location.path('/fail');
            }
        });
    };
});

colorAdminApp.controller('addJsonController', function ($scope, $state, $http, $location) {
    $scope.getFolderList = function () {
        var url = "/api/json/folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
    $scope.save = function () {
        let parameter = {
            title: $scope.title,
            folder_id: $scope.folder,
            genre: $scope.genre,
            type: $scope.type,
            position: $scope.position,
            duration: $scope.duration,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            language: $scope.language,
            rating: $scope.rating,
            cast: $scope.cast,
            release_date: $scope.release_date,
            thumbnail: $scope.thumbnail,
            video: $scope.video
        }
        $http.post('/api/json/add-json', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $location.path('/complete');
            } else {
                $location.path('/fail');
            }
        });
    };
    // $('#check').on("click", function () {
    //     let valid = true;
    //     $('[required]').each(function () {
    //         if ($(this).is(':invalid') || !$(this).val()) valid = false;
    //     })
    //     if (!valid) {
    //         alert("Please fill all fields!");
    //     } else {
    //         if (!$scope.folder) {
    //             alert("Please select folder!");
    //         } else {
    //             if ($scope.folder.length > 0) {
    //                $scope.save()
    //             }else if($scope.folder.length == 0){
    //                 alert("Please select folder!");
    //             }
    //         }
    //     }
    // })
    (function () {
        $('form > input').keyup(function () {

            var empty = false;
            $('form > input[required]').each(function () {
                if ($(this).val() == '') {
                    empty = true;
                }
            });

            if (empty) {
                $('#check').attr('disabled', 'disabled');
            } else {
                $('#check').removeAttr('disabled');
            }
        });
    })();
});

colorAdminApp.controller('adsJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/ads",
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
                {
                    data: "id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editads?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.id + '" checked>'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "type" },
                { data: "duration" },
                { data: "position" },
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
                },
                { data: "section", searchBy: true },
                { data: "city" },
                { data: "interstitial_time" },
                { data: "interstitial_count" },
                { data: "campaignName" }
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
        $scope.getData = function () {
            if ($scope.adstype) {
                $scope.type = $scope.adstype.map(function (p) { return '"' + p + '"'; }).join(',');
            }
            if ($scope.adssection) {
                $scope.section = $scope.adssection.map(function (p) { return '"' + p + '"'; }).join(',');
            }
            dautable.clear().draw();
        };
    };

    $scope.getTypeList = function () {
        var url = "/api/json/type-list";
        $http.get(url)
            .then(function (response) {
                $scope.typelist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.typelist.push($scope.data[index].type);
                }
            });
    };
    $scope.getSectionList = function () {
        var url = "/api/json/section-list";
        $http.get(url)
            .then(function (response) {
                $scope.sectionlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.sectionlist.push($scope.data[index].section);
                }
            });
    };
    $scope.getTypeList()
    $scope.getSectionList()
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
        $http.post('/api/json/change-ads-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newads";
        // $window.location.href = url;
        $location.url(url);
    }
});

// colorAdminApp.controller('editAdsController', function ($scope, $state, $http, $location) {
//     $http.get('/api/json/get-ads-details/' + $state.params.id).then(function (success) {
//         $scope.data = success.data;
//         $scope.id = $scope.data[0].id
//         $scope.title = $scope.data[0].title
//         $scope.type = $scope.data[0].type
//         $scope.position = $scope.data[0].position
//         $scope.duration = $scope.data[0].duration
//         $scope.start_time = $scope.data[0].start_time
//         $scope.end_time = $scope.data[0].end_time
//         $scope.section = $scope.data[0].section
//     });
//     $scope.save = function () {
//         var parameter = {
//             id: $scope.$state.params.id,
//             title: $scope.title,
//             type: $scope.type,
//             position: $scope.position,
//             duration: $scope.duration,
//             start_time: $scope.start_time,
//             end_time: $scope.end_time,
//             section: $scope.section
//         }
//         $http.post('/api/json/edit-ads', parameter).then(function (success) {
//             $scope.data = success;
//             if ($scope.data.status == 200) {
//                 alert("Successfully Updated.")
//                 let url = "/app/json/ad";
//                 // $window.location.href = url;
//                 $location.url(url);
//             } else {
//                 alert("Somthing went wrong, try again later.")
//                 // $location.path('/fail');
//             }
//         });
//     };
// });

colorAdminApp.controller('editAdsController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-ads-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.id = $scope.data[0].id
        $scope.title = $scope.data[0].title
        $scope.cast = $scope.data[0].cast
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.duration = $scope.data[0].duration
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
        $scope.section = $scope.data[0].section
        $scope.format = $scope.data[0].format
        $scope.subcat_id = $scope.data[0].subcat_id
        $scope.subcat_position = $scope.data[0].subcat_position
        $scope.deeplink = $scope.data[0].deeplink
        $scope.partner_id = $scope.data[0].partner_id
        $scope.brand = $scope.data[0].brand
        $scope.city = $scope.data[0].city
        $scope.interstitial_time = $scope.data[0].interstitial_time
        $scope.interstitial_count = $scope.data[0].interstitial_count
        $scope.campaignName = $scope.data[0].campaignName
    });
    $scope.save = function () {
        var parameter = {
            id: $scope.$state.params.id,
            title : $scope.title,
            cast : $scope.cast,
            description : $scope.description,
            type : $scope.type,
            position : $scope.position,
            duration : $scope.duration,
            start_time : $scope.start_time,
            end_time : $scope.end_time,
            platform : $scope.platform,
            section : $scope.section,
            format : $scope.format,
            subcat_id : $scope.subcat_id,
            subcat_position : $scope.subcat_position,
            deeplink : $scope.deeplink,
            partner_id : $scope.partner_id,
            brand : $scope.brand,
            city : $scope.city,
            interstitial_time : $scope.interstitial_time,
            interstitial_count : $scope.interstitial_count,
            campaignName : $scope.campaignName
        }
        $http.post('/api/json/edit-ads', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/ad";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});
colorAdminApp.controller('newAdsController', function ($scope, $state, $http, $location) {
    (function () {
        $('form > div > div > div > input').change(function () {
            var empty = false;
            $('form > div > div > div > input[required]').each(function () {
                if ($(this).val() == '') {
                    empty = true;
                }
            });
            if (empty) {
                $('#check').attr('disabled', 'disabled');
            } else {
                $('#check').removeAttr('disabled');
            }
        });
    })()
});

colorAdminApp.controller('gamesJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/games",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.folder_id = $scope.folder_id;
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
                {
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editgames?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "folder_id" },
                { data: "type" },
                { data: "position" },
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
                },
                { data: "platform" }
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/store-folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
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
        $http.post('/api/json/change-games-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newgames";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editGamesController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-games-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
        $scope.websiteUrl =  $scope.data[0].websiteUrl
    });
    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            description: $scope.description,
            type: $scope.type,
            position: $scope.position,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            platform: $scope.platform,
            websiteUrl: $scope.websiteUrl
        }
        $http.post('/api/json/edit-games', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/game";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});

colorAdminApp.controller('travelsJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/travels",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.folder_id = $scope.folder_id;
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
                {
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/edittravels?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "folder_id" },
                { data: "type" },
                { data: "position" },
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
                },
                { data: "platform" }
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/travel-folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
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
        $http.post('/api/json/change-travels-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newtravels";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editTravelsController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-travels-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
        $scope.price = $scope.data[0].price
        $scope.coupon_code = $scope.data[0].coupon_code
        $scope.coupon_code_percentage = $scope.data[0].coupon_code_percentage
        $scope.coupon_card_url = $scope.data[0].coupon_card_url
        $scope.ecom_link = $scope.data[0].ecom_link
    });

    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            description: $scope.description,
            type: $scope.type,
            position: $scope.position,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            platform: $scope.platform,
            price: $scope.price,
            coupon_code: $scope.coupon_code,
            coupon_code_percentage: $scope.coupon_code_percentage,
            coupon_card_url: $scope.coupon_card_url,
            ecom_link: $scope.ecom_link
        }
        $http.post('/api/json/edit-travels', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/travel";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});

colorAdminApp.controller('readJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/read",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.folder_id = $scope.folder_id;
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
                {
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editread?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "folder_id" },
                { data: "type" },
                { data: "position" },
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
                },
                { data: "platform" }
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/read-folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
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
        $http.post('/api/json/change-read-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newread";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editReadController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-read-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
    });

    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            description: $scope.description,
            type: $scope.type,
            position: $scope.position,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            platform: $scope.platform
        }
        $http.post('/api/json/edit-read', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/reads";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});

colorAdminApp.controller('mallJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/mall",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.folder_id = $scope.folder_id;
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
                {
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editmall?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "folder_id" },
                { data: "type" },
                { data: "position" },
                { data: "price" },
                { data: "coupon_code" },
                { data: "coupon_code_percentage" },
                {
                    data: "coupon_card_url",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "ecom_link" },

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
                },
                { data: "platform" }
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/mall-folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
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
        $http.post('/api/json/change-mall-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newmall";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editMallController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-mall-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.price = $scope.data[0].price
        $scope.coupon_code = $scope.data[0].coupon_code
        $scope.coupon_code_percentage = $scope.data[0].coupon_code_percentage
        $scope.coupon_card_url = $scope.data[0].coupon_card_url
        $scope.ecom_link = $scope.data[0].ecom_link
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
    });

    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            description: $scope.description,
            type: $scope.type,
            position: $scope.position,
            price: $scope.price,
            coupon_code: $scope.coupon_code,
            coupon_code_percentage: $scope.coupon_code_percentage,
            coupon_card_url: $scope.coupon_card_url,
            ecom_link: $scope.ecom_link,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            platform: $scope.platform
        }
        $http.post('/api/json/edit-mall', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/malls";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});

colorAdminApp.controller('fnbJsonLogsController', function ($scope, $http, $window, $location, $cookieStore) {
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
                url: "/api/json/fnb",
                data: function (d) {
                    // d.startDate = $scope.startDate;
                    // d.endDate = $scope.endDate;
                    d.folder_id = $scope.folder_id;
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
                {
                    data: "content_id", searchBy: true,
                    render: function (data) {
                        return data = '<a href="/app/json/editfnb?id=' + data + '">' + data + '</a>';
                    }
                },
                {
                    data: "status",
                    render: function (data, type, row) {
                        if (data == 1) {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '" checked>'
                                + ' <span class="slider round"></span>'
                                + ' </label>'
                        } else {
                            return data = '<label class="switch">'
                                + ' <input type="checkbox" data-name="' + data + '" data-id="' + row.content_id + '">'
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
                // { data: "content_id",searchBy:true },
                { data: "title", searchBy: true },
                { data: "description", visible: false },
                { data: "folder_id" },
                { data: "type" },
                { data: "position" },
                { data: "price" },
                { data: "coupon_code" },
                { data: "coupon_code_percentage" },
                {
                    data: "coupon_card_url",
                    render: function (data) {
                        return "<img src=" + data + " style= 'width: 70px; height: 47px'></img>";
                    }
                },
                { data: "ecom_link" },

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
                },
                { data: "platform" },
                { data: "ftype" }
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
        $scope.getData = function () {
            let folderId = [];
            if ($scope.folder) {
                for (let i = 0; i < $scope.folder.length; i++) {
                    const element = $scope.folder[i].id;
                    folderId.push(element)
                }
                $scope.folder_id = folderId.join(",")
            }
            dautable.clear().draw();
        };
    };

    $scope.getFolderList = function () {
        var url = "/api/json/fnb-folder-list";
        $http.get(url)
            .then(function (response) {
                $scope.folderlist = [];
                $scope.data = response.data;
                for (let index = 0; index < $scope.data.length; index++) {
                    $scope.folderlist.push({ "id": $scope.data[index].id, "folder": $scope.data[index].folder });
                }
            });
    };
    $scope.getFolderList()
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
        $http.post('/api/json/change-fnb-status', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                $window.location.reload();
                // $location.path('/app/json/view');
            } else {
                $location.path('/fail');
            }
        });
    });
    $scope.redirect = function () {
        let url = "/app/json/newfnb";
        // $window.location.href = url;
        $location.url(url);
    }
});

colorAdminApp.controller('editFnBController', function ($scope, $state, $http, $location) {
    $http.get('/api/json/get-fnb-details/' + $state.params.id).then(function (success) {
        $scope.data = success.data;
        $scope.content_id = $scope.data[0].content_id
        $scope.title = $scope.data[0].title
        $scope.folder_id = $scope.data[0].folder_id
        $scope.description = $scope.data[0].description
        $scope.type = $scope.data[0].type
        $scope.position = $scope.data[0].position
        $scope.price = $scope.data[0].price
        $scope.coupon_code = $scope.data[0].coupon_code
        $scope.coupon_code_percentage = $scope.data[0].coupon_code_percentage
        $scope.coupon_card_url = $scope.data[0].coupon_card_url
        $scope.ecom_link = $scope.data[0].ecom_link
        $scope.start_time = $scope.data[0].start_time
        $scope.end_time = $scope.data[0].end_time
        $scope.platform = $scope.data[0].platform
        $scope.ftype = $scope.data[0].ftype
    });

    $scope.save = function () {
        var parameter = {
            content_id: $scope.$state.params.id,
            title: $scope.title,
            folder_id: $scope.folder_id,
            description: $scope.description,
            type: $scope.type,
            position: $scope.position,
            price: $scope.price,
            coupon_code: $scope.coupon_code,
            coupon_code_percentage: $scope.coupon_code_percentage,
            coupon_card_url: $scope.coupon_card_url,
            ecom_link: $scope.ecom_link,
            start_time: $scope.start_time,
            end_time: $scope.end_time,
            platform: $scope.platform,
            ftype: $scope.ftype
        }
        $http.post('/api/json/edit-fnb', parameter).then(function (success) {
            $scope.data = success;
            if ($scope.data.status == 200) {
                alert("Successfully Updated.")
                let url = "/app/json/fnbs";
                // $window.location.href = url;
                $location.url(url);
            } else {
                alert("Somthing went wrong, try again later.")
                // $location.path('/fail');
            }
        });
    };
});