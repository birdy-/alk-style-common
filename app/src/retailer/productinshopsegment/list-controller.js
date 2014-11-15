'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopSegmentListController', [
    '$scope', '$$ORM', '$log', 'permission',
    function ($scope, $$ORM, $log, permission) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.request = {
            productInShopSegment: {
                name: null,
                shortId: null,
                type: ProductInShopSegment.TYPE_CONTACT.id
            },
            shop: {
                shortId: null
            },
            offset: 0,
            limit: 20
        };

        $scope.productInShopSegments = [];

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        $scope.refresh = function () {
            $$ORM.repository('ProductInShopSegment').list({
                name: $scope.request.productInShopSegment.name
            }, {
                shortId: $scope.request.productInShopSegment.shortId,
                type: $scope.request.productInShopSegment.type,
                shop_id: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit).then(function (productInShopSegments) {
                $scope.productInShopSegments = productInShopSegments;
            });
        };
        $scope.prev = function () {
            $scope.request.offset = Math.max(0, $scope.request.offset - $scope.request.limit);
            $scope.refresh();
        };
        $scope.next = function () {
            $scope.request.offset = $scope.request.offset + $scope.request.limit;
            $scope.refresh();
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function (user) {
            $scope.request.shop.shortId = user.managesShop.map(function (shop) {
                return shop.id;
            })[0];
            $scope.refresh();
        });

    }
]);
