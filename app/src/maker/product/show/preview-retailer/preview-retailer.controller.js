'use_strict';

angular.module('jDashboardFluxApp')

.controller('DashboardMakerProductShowRetailerPreviewController', [
    '$scope',
    function ($scope) {
        var shopsMap = {
            1: null
        };

        var extractShortIdOut = function (shopsMap) {
            _.map($scope.product.isInstantiatedBy, function (pish) {
                console.log(pish);
                console.log(pish.isSoldBy.id);
                if (typeof shopsMap[pish.isSoldBy.id] !== 'undefined') {
                    shopsMap[pish.isSoldBy.id] = pish;
                }
            });

            return shopsMap;
        };

        var createIFrame = function (shopsMap) {
            _.forEach(shopsMap, function (pish, shopId) {
                ALK.ui({
                    name: 'productpage',
                    productInShopShortIdOut: pish.shortIdOut,
                    shopId: shopId,
                    container: window.$('.product-preview-auchandrive')[0]});
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
