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
                $scope.notCertified = parseInt($scope.brand.stats.counts['5'], 10) + parseInt($scope.brand.stats.counts['1'], 10) || 0;
                $scope.certified = parseInt($scope.brand.stats.counts['2']) || 0

                $scope.goToProducts = function (brandId, certified) {
                    $rootScope.navigation.maker.request = {
                        product: {
                            isIdentifiedBy: {},
                            certifieds: []
                        }
                    };

                    if (certified) {
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
                    } else {
                        $rootScope.navigation.maker.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = true;
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
