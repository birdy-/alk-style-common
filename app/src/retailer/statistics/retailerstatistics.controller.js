'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('RetailerDataStatisticsController', [
    'permission', '$scope', '$$sdkCrud', '$log',
    function (permission, $scope, $$sdkCrud, $log) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        var get = function (shopId) {
            return $$sdkCrud['StatisticsShow'](['productinshop', 'product', 'productbrand'], shopId).then(function(response) {
                $scope.stats = response.data;
            });
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function(user){
            var shopIds = user.managesShop.map(function(shop){
                return shop.id;
            });
            get(shopIds[0]);
        });
    }
]);



angular.module('jDashboardFluxApp').controller('RetailerProductStatisticsController', [

    'permission', '$scope', '$$sdkCrud', '$modal', '$log',
    function (permission, $scope, $$sdkCrud, $modal, $log) {


        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.request = {
            productInShop: {
                name: null,
                shortIdOut: null
            },
            productReference: {
                reference: null
            },
            product: {
                certifed: null
            },
            shop: {
                shortId: null
            },
            offset: 0,
            limit: 20
        };

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        var get = function (shopId) {
            return $$sdkCrud['StatisticsShow'](['productinshop', 'product', 'productbrand'], shopId).then(function(response) {
                var productInShopStats = response.data.data.filter(function(stat){
                    return stat.type == 'ProductInShop';
                })[0].stats;
                $scope.stats = {
                    total: productInShopStats[0].value,
                    missing: null,
                    attributed: productInShopStats[2].value,
                    certified: productInShopStats[1].value
                };
                $scope.stats.missing = $scope.stats.total - $scope.stats.attributed - $scope.stats.certified;
            });
        };

        $scope.refresh = function() {
            $$sdkCrud.ProductInShopList({
                productinshop_name: $scope.request.productInShop.name
            }, {
                shortIdOut: $scope.request.productInShop.shortIdOut,
                shop_shortId: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit).then(function(response){
                $scope.productInShops = response.data.data;
            });
        };
        $scope.prev = function() {
            $scope.request.offset = Math.max(0, $scope.request.offset - $scope.request.limit);
            $scope.refresh();
        };
        $scope.next = function() {
            $scope.request.offset = $scope.request.offset + $scope.request.limit;
            $scope.refresh();
        };

        $scope.isAttributed = function(productInShop) {
            var certified = productInShop.instantiates.certified;
            return [
                Product.CERTIFICATION_STATUS_ATTRIBUTED.id,
                Product.CERTIFICATION_STATUS_ACCEPTED.id,
                Product.CERTIFICATION_STATUS_CERTIFIED.id,
                Product.CERTIFICATION_STATUS_PUBLISHED.id
            ].indexOf(certified) !== -1;
        };
        $scope.attribute = function(productInShop) {
            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/statistics/attribution-modal.html',
                controller: 'ProductAttributionModalController',
                resolve: {
                    productInShop: function () {return productInShop; },
                    user: function () {return $scope.user; }
                }
            });


            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function(user){
            $scope.user = user;
            var shopId = user.managesShop.map(function(shop){
                return shop.id;
            })[0];
            $scope.request.shop.shortId = shopId;
            get(shopId);
        });

    }
]);
