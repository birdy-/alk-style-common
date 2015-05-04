'use strict';

angular.module('jDashboardFluxApp').directive('brandRow', [
    '$rootScope', '$location',
    function ($rootScope, $location) {
        return {
            restrict: 'A',
            scope: {
              brand: '='
            },
            templateUrl: '/src/maker/brand/directive/brand-row/brand-row.view.html',
            link: function($scope, $elem, $attrs) {
                $scope.display = {
                    allProducts: false
                };
                if ($scope.brand.stats) {
                    var accepted = parseInt($scope.brand.stats.counts[Product.CERTIFICATION_STATUS_ACCEPTED.id], 10) || 0;
                    var attributed = parseInt($scope.brand.stats.counts[Product.CERTIFICATION_STATUS_ATTRIBUTED.id], 10) || 0;
                    $scope.notCertified = accepted;
                    $scope.certified = parseInt($scope.brand.stats.counts[Product.CERTIFICATION_STATUS_CERTIFIED.id]) || 0;
                }

                $scope.goToProducts = function (brandId, certified) {
                    $rootScope.navigation.maker.request = {
                        product: {
                            isIdentifiedBy: {},
                            certifieds: []
                        }
                    };

                    if (certified === 'all') {
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
                    } else if (certified) {
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
                    } else {
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = false;
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
                    }

                    $rootScope.navigation.maker.request.offset = 0;
                    $rootScope.navigation.maker.request.limit = 24;
                    $rootScope.navigation.maker.request.busy = false;

                    $rootScope.navigation.maker.request.initialized = true;
                    $location.path('/maker/brand/' + brandId + '/product');
              };
            }
        };
    }
]);
