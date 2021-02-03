/*   
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 1.9.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v1.9/admin/
*/

/* Prevent Global Link Click
------------------------------------------------ */

colorAdminApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault();
                });
            }
        }
    };
});

/*   
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 1.9.0
Author: Manoj Kaushik
Website: http://www.seantheme.com/color-admin-v1.9/admin/
*/

/* Enter Event (call on enter key  press)
------------------------------------------------ */
colorAdminApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

// Angular File Upload module does not include this directive
    // Only for example


    /**
    * The ng-thumb directive
    * @author: nerv
    * @version: 0.1.2, 2014-01-09
    */
colorAdminApp.directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
colorAdminApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});
colorAdminApp.directive('imageOnload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                // call the function that was passed
                scope.$apply(attrs.imageOnload);
                
                // usage: <img ng-src="src" image-onload="imgLoadedCallback()" />
            });
        }
    };
});
// colorAdminApp.directive('ngUploadForm', [function () {
//       return {
//         restrict: 'E',
//         templateUrl: '/assets/plugins/jQuery-File-Upload-master/templates/fileform.html',
//         scope: {
//           allowed: '@',
//           url: '@',
//           autoUpload: '@',
//           sizeLimit: '@',
//           ngModel: '=',
//           name: '@'
//         },
//         controller: ['$scope', '$element', 'fileUpload', function (
//             $scope, $element, fileUpload) {
//           $scope.$on('fileuploaddone', function (e, data) {
//             fileUpload.addFieldData($scope.name, data._response.result.files[0].result);
//           });

//           $scope.options = {
//             url: $scope.url,
//             dropZone: $element,
//             maxFileSize: $scope.sizeLimit,
//             autoUpload: $scope.autoUpload
//           };
//           $scope.loadingFiles = false;

//           if (!$scope.queue) {
//             $scope.queue = [];
//           }

//           var generateFileObject = function generateFileObjects(objects) {
//             angular.forEach(objects, function (value, key) {
//               var fileObject = {
//                 name: value.filename,
//                 size: value.length,
//                 url: value.url,
//                 thumbnailUrl: value.url,
//                 deleteUrl: value.url,
//                 deleteType: 'DELETE',
//                 result: value
//               };

//               if (fileObject.url && fileObject.url.charAt(0) !== '/') {
//                 fileObject.url = '/' + fileObject.url;
//               }

//               if (fileObject.deleteUrl && fileObject.deleteUrl.charAt(0) !== '/') {
//                 fileObject.deleteUrl = '/' + fileObject.deleteUrl;
//               }

//               if (fileObject.thumbnailUrl && fileObject.thumbnailUrl.charAt(0) !== '/') {
//                 fileObject.thumbnailUrl = '/' + fileObject.thumbnailUrl;
//               }

//               $scope.queue[key] = fileObject;
//             });
//           };
//           fileUpload.registerField($scope.name);
//           $scope.filequeue = fileUpload.fieldData[$scope.name];

//           $scope.$watchCollection('filequeue', function (newval) {
//             generateFileObject(newval);
//           });
//         }]
//       };
//     }])
//     .controller('FileDestroyController', ['$scope', '$http', 'fileUpload', function (
//         $scope, $http, fileUpload) {
//       var file = $scope.file,
//         state;

//       if ($scope.$parent && $scope.$parent.$parent && $scope.$parent.$parent.$parent.name) {
//         $scope.fieldname = $scope.$parent.$parent.$parent.name;
//       }

//       if (!fileUpload.fieldData[$scope.name]) {
//         fileUpload.fieldData[$scope.name] = [];
//       }

//       $scope.filequeue = fileUpload.fieldData;

//       if (file.url) {
//         file.$state = function () {
//           return state;
//         };
//         file.$destroy = function () {
//           state = 'pending';
//           return $http({
//             url: file.deleteUrl,
//             method: file.deleteType
//           }).then(
//             function () {
//               state = 'resolved';
//               fileUpload.removeFieldData($scope.fieldname, file.result._id);
//               $scope.clear(file);
//             },
//             function () {
//               state = 'rejected';
//               fileUpload.removeFieldData($scope.fieldname, file.result._id);
//               $scope.clear(file);
//             }
//           );


//         };
//       } else if (!file.$cancel && !file._index) {
//         file.$cancel = function () {
//           $scope.clear(file);
//         };
//       }
//     }
//     ]);