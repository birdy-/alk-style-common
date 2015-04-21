'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopSegmentListController', [
    '$scope', '$$ORM', '$routeParams', '$location', '$log', 'permission', '$$sdkCrud', '$modal',
    function ($scope, $$ORM, $routeParams, $location, $log, permission, $$sdkCrud, $modal) {

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
            limit: 20,
            totalProductSegments: 0,
            totalPages: 0,
        };

        $scope.currentPage = 1;
        $scope.productInShopSegments = [];

        // ------------------------------------------------------------------------
        // Data retrievers
        // ------------------------------------------------------------------------
        var list = function () {
            $scope.request.offset = ($scope.currentPage - 1) * $scope.request.limit;

            $$ORM.repository('ProductInShopSegment').list({
                name: $scope.request.productInShopSegment.name,
                shortId: $scope.request.productInShopSegment.shortId
            }, {
                type: $scope.request.productInShopSegment.type,
                shop_id: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit).then(function (segments) {
                if (segments.length == 0 && $scope.currentPage > 1) {
                    $scope.currentPage = 1;
                    list();
                } else {
                    $scope.productInShopSegments = segments;
                    $scope.request.totalProductSegments = segments.totalResults;
                    $scope.request.totalPages = Math.floor(segments.totalResults / $scope.request.limit) + 1;

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
                }
            });
        }

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------

        var setPageFromUrl = function() {
            var pageInRoute = Number($routeParams.page);
            if ($routeParams.page !== undefined && pageInRoute > 1) {
                $scope.currentPage = pageInRoute;
            } else {
                $scope.currentPage = 1;
            }
        };

        $scope.onPageChangeFromPaginator = function() {
            list();
        };

        $scope.refresh = function () {
            $scope.request.offset = 0;
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

        /* Automatically update route params if the current page change */
        $scope.$watch('currentPage', function(newVal, oldVal) {
            if (oldVal != newVal) {
                $location.search("page", newVal);
            }
        });

        /*
         * Handle browser back/next calls
         * reloadOnSearch on this page have been set to false involving
         * that it won't reload the page, that's why we have to check
         * manually the new route parameters
         */
        $scope.$on('$routeUpdate',function(e) {
            var oldPage = $scope.currentPage;
            setPageFromUrl();
            if (oldPage != $scope.currentPage) {
                list();
            }
        });



        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        setPageFromUrl();

        permission.getUser().then(function (user) {
            $scope.request.shop.shortId = user.managesShop.map(function (shop) {
                return shop.id;
            })[0];
            $scope.refresh();
        });


    }
]);
