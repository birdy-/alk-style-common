'use_strict';

angular.module('jDashboardFluxApp')

.controller('DashboardMakerProductShowRetailerPreviewController', [
    '$scope', '$log', '$sce',
    function ($scope, $log, $sce) {
        var shopsMap = {
            1: null
        };

        var extractShortIdOut = function (shopsMap) {
            _.map($scope.product.isInstantiatedBy, function (pish) {
                if (typeof shopsMap[pish.isSoldBy.id] !== 'undefined') {
                    shopsMap[pish.isSoldBy.id] = pish;
                }
            });

            return shopsMap;
        };

        var createIFrame = function (shopsMap) {
            $log.debug('Creating iframe for the following map:', shopsMap);
            _.forEach(shopsMap, function (pish, shopId) {
                if (!pish) { return; }
                pish.previewUrl = $sce.trustAsResourceUrl('https://sassets.toc.io/interfaces/product/v2/index.html#/?productinshop_shortidout=' + pish.shortIdOut + '&shop_id=1&jrmac=UA-0000-0&app_id=UA-0000-0&client_id=dashboard_stream&no_cache=1');
            });
        };

        var init = function () {
            $scope.shopsMap = extractShortIdOut(shopsMap);
            createIFrame($scope.shopsMap);
        }

        var productWatch = $scope.$watch('product', function () {
            if (!$scope.product
            || !$scope.product.id) {
                return;
            }
            init();
            productWatch();
        }, true);
    }
]);
