'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductListController', [
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

        $scope.productInShops = [];


        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        var get = function (shopId) {
            return $$sdkCrud.StatisticsShow(['productinshop', 'product', 'productbrand'], shopId).then(function(response) {
                var productInShopStats = response.data.data.filter(function(stat){
                    return stat.type === 'ProductInShop';
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
            return [
                Product.CERTIFICATION_STATUS_ATTRIBUTED.id,
                Product.CERTIFICATION_STATUS_ACCEPTED.id,
                Product.CERTIFICATION_STATUS_CERTIFIED.id,
                Product.CERTIFICATION_STATUS_PUBLISHED.id
            ].indexOf(productInShop.instantiates.certified) !== -1;
        };

        $scope.attribute = function(productInShop) {

            // Check if we have selected multiple Products
            var selectedProductInShops = $scope.productInShops.filter(function (productInShop) {
                return productInShop.selected;
            });
            if (selectedProductInShops.length === 0) {
                selectedProductInShops = [productInShop];
            }

            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/statistics/attribution-modal.html',
                controller: 'ProductAttributionModalController',
                resolve: {
                    productInShops: function () { return selectedProductInShops; },
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
