'use strict';

angular.module('jDashboardFluxApp').directive('tabProduct', [
    '$location', '$modal',
    function ($location, $modal) {
        return {
            restrict: 'AEC',
            scope: {
                product: '&',
                locked: '='
            },
            replace: true,
            templateUrl: '/src/maker/product/show/template/tabProduct.html',
            link: function (scope, element, attrs) {
                scope.legend = attrs.legend;
                scope.color = attrs.color;
                scope.link = attrs.link;

                var active = function () {
                    return $location.path().indexOf(scope.link) !== -1;
                };

                var openPreview = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/src/maker/product/show/preview-retailer/preview-retailer.html',
                        controller: 'DashboardMakerProductShowRetailerPreviewController',
                        size: 'lg',
                        resolve: {
                            productReference: function () { return scope.product(); }
                        }
                    });
                }

                scope.classes = function () {
                    var classes = {};
                    if (active()) {
                        classes.active = true;
                    }
                    if (scope.locked) {
                        classes.disabled = true;
                    }
                    return classes;
                };

                scope.go = function () {
                    if(scope.legend === 'Visualiser') {
                        openPreview();
                        return;
                    } else {
                        $location.path('/maker/product/' + scope.product() + '/data/' + scope.link);
                    }
                };
            }
        };
    }
]);
