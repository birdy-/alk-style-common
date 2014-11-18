'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopSegmentListController', [
    '$scope', '$$ORM', '$log', 'permission', '$$sdkCrud',
    function ($scope, $$ORM, $log, permission, $$sdkCrud) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------

        var certification_map = {
            'DEFAULT': '0',
            'REVIEWING': '4',
            'ATTRIBUTED': '5',
            'ACCEPTED': '1',
            'CERTIFIED': '2',
            'PUBLISHED': '3',
            'DISCONTINUED': '6'
        }

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
            }, {}, $scope.request.limit, $scope.request.offset).then(function (productInShopSegments) {
                $scope.productInShopSegments = productInShopSegments;
                var pishsIds = [];
                for (var i in $scope.productInShopSegments) {
                    pishsIds.push($scope.productInShopSegments[i].id);
                }
                $$sdkCrud.ProductInShopSegmentStatistics(pishsIds).then(function (response) {
                    var data = response.data.data;
                    for (var i in $scope.productInShopSegments) {
                        var segment = $scope.productInShopSegments[i];
                        segment.statistics = []
                        segment.statistics[Product.CERTIFICATION_STATUS_DEFAULT.id] = 0;
                        segment.statistics[Product.CERTIFICATION_STATUS_REVIEWING.id] = 0
                        segment.statistics[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = 0
                        segment.statistics[Product.CERTIFICATION_STATUS_ACCEPTED.id] = 0
                        segment.statistics[Product.CERTIFICATION_STATUS_CERTIFIED.id] = 0
                        segment.statistics[Product.CERTIFICATION_STATUS_PUBLISHED.id] = 0
                        segment.statistics[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = 0
                        for (var j in data) {
                            if (data[j].about.id == segment.id) {
                                segment.statistics = data[j].counts;
                                break;
                            }
                        }
                        segment.statistics.inProgress = segment.statistics[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] +
                        segment.statistics[Product.CERTIFICATION_STATUS_PUBLISHED.id] + segment.statistics[Product.CERTIFICATION_STATUS_ACCEPTED.id];
                        segment.statistics.certified = segment.statistics[Product.CERTIFICATION_STATUS_CERTIFIED.id];
                        segment.statistics.total = segment.statistics.inProgress + segment.statistics.certified;                    }
                });
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
