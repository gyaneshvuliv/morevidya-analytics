
/* -------------------------------
   9.0 CONTROLLER - Dashboard v2
------------------------------- */
colorAdminApp.controller('dashboardController', function ($scope, $rootScope, $state, $http) {
    /* Gritter Notification
    ------------------------- */

    $scope.get_server_static_count = function () {
        $http({ url: "/api/dashboard/server-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.total_client = data[0].total_client;
                    $scope.total_server = data[0].total_server;
                    $scope.today_client = data[0].today_client;
                    $scope.today_server = data[0].today_server;
                    $scope.y_client = data[0].y_client;
                    $scope.y_server = data[0].y_server;
                }
            }).error(function (data, status, headers, config) {
            });
    } 
    $scope.get_vp_server_static_count = function () {
        $http({ url: "/api/dashboard/vp-server-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.vp_total_client = data[0].total_client;
                    $scope.vp_total_server = data[0].total_server;
                    $scope.vp_today_client = data[0].today_client;
                    $scope.vp_today_server = data[0].today_server;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_played_static_count = function () {
        $http({ url: "/api/dashboard/played-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.total_played = data[0].total_played;
                    $scope.today_played = data[0].today_played;
                    $scope.y_played = data[0].y_played;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_watch_login_count = function () {
        $http({ url: "/api/dashboard/watch-login-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.total_login = data[0].total_played;
                    $scope.today_login = data[0].today_played;
                    $scope.y_login = data[0].y_played;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_wifi_login_count = function () {
        $http({ url: "/api/dashboard/wifi-login-count", method: "GET" })
            .success(function (data, status, headers, config) {
              
        
                    $scope.today_wifi_login = data.tlogin;
                    $scope.y_wifi_login = data.ylogin;
                    $scope.total_wifi_login = data.ttlogin;
                    $scope.avgUser = data.avg;
                
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_vp_played_static_count = function () {
        $http({ url: "/api/dashboard/vp-played-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.vp_total_played = data[0].total_played;
                    $scope.vp_today_played = data[0].today_played;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_Platform_durationss = function () {
        $http({ url: "/api/dashboard/platform-durationss", method: "GET" })
            .success(function (data, status, headers, config) {

                
                console.log(data.tsday);
                console.log("today")
               
                    
                    $scope.today_durations = data.tsday;
                    $scope.y_durations = data.ysday;
            
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_Platform_duration_ysday = function () {
        $http({ url: "/api/dashboard/platform-duration-yday", method: "GET" })
            .success(function (data, status, headers, config) {
                console.log(data.ysday);
                console.log("yday")
                                    
                $scope.y_durations = data.ysday;
                    
                
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_vp_duration_static_count = function () {
        $http({ url: "/api/dashboard/vp-duration-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.vp_total_duration = data[0].total_duration;
                    $scope.vp_today_duration = data[0].today_duration;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_currmonth_static_count = function () {
        $http({ url: "/api/dashboard/currmonth-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.month_mau = data[0].month_mau;
                    $scope.today_dau = data[0].today_dau;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_vp_currmonth_static_count = function () {
        $http({ url: "/api/dashboard/vp-currmonth-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.vp_month_mau = data[0].month_mau;
                    $scope.vp_today_dau = data[0].today_dau;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_premonth_static_count = function () {
        $http({ url: "/api/dashboard/premonth-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.premonth_mau = data[0].premonth_mau;
                    $scope.yesterday_dau = data[0].yesterday_dau;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_vp_premonth_static_count = function () {
        $http({ url: "/api/dashboard/vp-premonth-static-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.vp_premonth_mau = data[0].premonth_mau;
                    $scope.vp_yesterday_dau = data[0].yesterday_dau;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_totaClick_peruser_count = function () {
        $http({ url: "/api/dashboard/click-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_cpu = data[0].t_fpu;
                    $scope.y_cpu = data[0].y_fpu;
                    $scope.total_cpu = data[0].total_fpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_fileplayed_peruser_count = function () {
        $http({ url: "/api/dashboard/file-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_fpu = data[0].t_fpu;
                    $scope.y_fpu = data[0].y_fpu;
                    $scope.total_fpu = data[0].total_fpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_gameplayed_peruser_count = function () {
        $http({ url: "/api/dashboard/game-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_gpu = data[0].t_gpu;
                    $scope.y_gpu = data[0].y_gpu;
                    $scope.total_gpu = data[0].total_gpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }

    $scope.get_fnbClick_peruser_count = function () {
        $http({ url: "/api/dashboard/fnb-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_fnbcpu = data[0].t_fpu;
                    $scope.y_fnbcpu = data[0].y_fpu;
                    $scope.total_fnbcpu = data[0].total_fpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_audioClick_peruser_count = function () {
        $http({ url: "/api/dashboard/audio-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_acpu = data[0].t_fpu;
                    $scope.y_acpu = data[0].y_fpu;
                    $scope.total_acpu = data[0].total_fpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_magzineClick_peruser_count = function () {
        $http({ url: "/api/dashboard/magzine-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_pdfpu = data[0].t_fpu;
                    $scope.y_pdfpu = data[0].y_fpu;
                    $scope.total_pdfpu = data[0].total_fpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_gametime_peruser_count = function () {
        $http({ url: "/api/dashboard/gametime-per-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_gtpu = data[0].t_gtpu;
                    $scope.y_gtpu = data[0].y_gtpu;
                    $scope.total_gtpu = data[0].total_gtpu;
                    $scope.t_ptpu = data[0].t_ptpu;
                    $scope.y_ptpu = data[0].y_ptpu;
                    $scope.total_ptpu = data[0].total_ptpu;
                }
            }).error(function (data, status, headers, config) {
            });
    }
    $scope.get_gameplay_overlap_count = function () {
        $http({ url: "/api/dashboard/gameplay-overlap-user-count", method: "GET" })
            .success(function (data, status, headers, config) {
                if (data && data.length > 0) {
                    $scope.t_golap = data[0].t_golap;
                    $scope.y_golap = data[0].y_golap;
                    $scope.t_polap = data[0].t_polap;
                    $scope.y_polap = data[0].y_polap;
                    $scope.total_gpolap = data[0].total_gpolap;
                }
            }).error(function (data, status, headers, config) {
            });
    }
 
    $scope.get_role = function () {
        $http({ url: "/api/users/user/get-role", method: "GET" })
            .success(function (data, status, headers, config) {
                $scope.role = data
                if ($scope.role == "admin" || $scope.role == "user") {
                    $scope.get_server_static_count()
                    $scope.get_played_static_count()
                    $scope.get_Platform_durationss()
                    // $scope.get_Platform_duration_today()
                    // $scope.get_duration_static_count()
                    $scope.get_currmonth_static_count()
                    $scope.get_premonth_static_count()
                    $scope.get_fileplayed_peruser_count()
                    $scope.get_gameplayed_peruser_count()
                    $scope.get_gametime_peruser_count()
                    $scope.get_gameplay_overlap_count()
                    $scope.get_totaClick_peruser_count()
                    $scope.get_fnbClick_peruser_count()
                    $scope.get_audioClick_peruser_count()
                    $scope.get_magzineClick_peruser_count()
                    $scope.get_wifi_login_count()
                    $scope.get_watch_login_count()
                   
                }
                if ($scope.role == "vuscreenvuprime") {
                    $scope.get_server_static_count()
                    $scope.get_played_static_count()
                    $scope.get_duration_static_count()
                    $scope.get_currmonth_static_count()
                    $scope.get_premonth_static_count()
                    $scope.get_vp_server_static_count()
                    $scope.get_vp_played_static_count()
                    $scope.get_vp_duration_static_count()
                    $scope.get_vp_currmonth_static_count()
                    $scope.get_vp_premonth_static_count()
                }
            }).error(function (data, status, headers, config) {
            });

    }
    $scope.get_role()
});

