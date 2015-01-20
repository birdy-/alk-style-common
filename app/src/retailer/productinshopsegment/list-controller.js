'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopSegmentListController', [
    '$scope', '$$ORM', '$log', 'permission', '$$sdkCrud', '$modal',
    function ($scope, $$ORM, $log, permission, $$sdkCrud, $modal) {

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
        // Data retrievers
        // ------------------------------------------------------------------------
        var list = function () {
            $$ORM.repository('ProductInShopSegment').list({
                name: $scope.request.productInShopSegment.name,
                shortId: $scope.request.productInShopSegment.shortId
            }, {
                type: $scope.request.productInShopSegment.type,
                shop_id: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit).then(function (segments) {
                $scope.productInShopSegments = segments;
                var segmentIds = $scope.productInShopSegments.map(function (segment) {
                    return segment.id;
                });
                if (!segmentIds.length) {
                    return;
                }
                $$sdkCrud.ProductInShopSegmentStatistics(segmentIds).then(function (response) {
                    response.data.data.forEach(function (stat) {
                        var segment = $$ORM.repository('ProductInShopSegment').lazy(stat.about.id);
                        segment.statistics = {};
                        segment.statistics.inProgress = stat.counts[Product.CERTIFICATION_STATUS_ATTRIBUTED.id]
                                                      + stat.counts[Product.CERTIFICATION_STATUS_ACCEPTED.id];
                        segment.statistics.certified = stat.counts[Product.CERTIFICATION_STATUS_CERTIFIED.id]
                                                     + stat.counts[Product.CERTIFICATION_STATUS_PUBLISHED.id]
                                                     + stat.counts[Product.CERTIFICATION_STATUS_DISCONTINUED.id];
                        segment.statistics.total = segment.statistics.inProgress
                                                 + segment.statistics.certified;
                    });
                });
            });
        }

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        $scope.refresh = function () {
            $scope.request.offset = 0;
            list();
        };
        $scope.prev = function () {
            $scope.request.offset = Math.max(0, $scope.request.offset - $scope.request.limit);
            list();
        };
        $scope.next = function () {
            $scope.request.offset = $scope.request.offset + $scope.request.limit;
            list();
        };
        $scope.edit = function (segment) {
            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/productinshopsegment/edit-modal/edit-modal.html',
                controller: 'ProductInShopSegmentEditModalController',
                resolve: {
                    productInShopSegment: function () { return segment; }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                list();
            });
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
