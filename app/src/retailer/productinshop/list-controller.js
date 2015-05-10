'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopListController', [
    'permission', '$scope', '$rootScope', '$$sdkCrud', '$location', '$modal', '$log', '$$ORM', '$routeParams',
    function (permission, $scope, $rootScope, $$sdkCrud, $location, $modal, $log, $$ORM, $routeParams) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.request = {
            shop: {
                shortId: null
            },
            stats: {},
            offset: 0,
            limit: 50,
            totalProducts: 0,
            totalPages: 0
        };
        $scope.restrict = {};
        $scope.stats = {
            attributed: null,
            certified: null,
            total: null,
            missing: null
        };
        $scope.productInShops = [];
        $scope.segment = null;

        $scope.allSelected = null;

        $scope.currentPage  = 1;

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

        /**
         * Find the ProductInShopSegment that is used for active products
         */
        var getSegment = function (shopId) {
            return $$ORM.repository('ProductInShopSegment').list({}, {
                shortId: 'INCO',
                type: ProductInShopSegment.TYPE_TECHNICAL.id,
                shop_id: shopId,
                shop_shortId: shopId
            }).then(function (segments) {
                if (segments.length != 1) {
                    $log.warn("Incoherent ProductInShopSegment for active products.");
                    throw "Incoherent ProductInShopSegment for active products.";
                }
                return segments[0];
            });
        };

        /**
         * Retrieve the stats for this ProductInShopSegment.
         */
        var getStats = function (segment) {
            $scope.segment = segment;
            if (!segment.id) { return; }
            return $$ORM.repository('ProductInShopSegment').method('Statistics')([segment.id]).then(function (stats) {
                stats = stats[0].counts;
                $scope.stats.attributed = stats[Product.CERTIFICATION_STATUS_ATTRIBUTED.id]
                                        + stats[Product.CERTIFICATION_STATUS_ACCEPTED.id];
                $scope.stats.certified = stats[Product.CERTIFICATION_STATUS_CERTIFIED.id]
                                       + stats[Product.CERTIFICATION_STATUS_DISCONTINUED.id]
                                       + stats[Product.CERTIFICATION_STATUS_PUBLISHED.id];
                $scope.stats.total = 0;
                angular.forEach(stats, function (value, key) {
                    $scope.stats.total += value;
                });
                $scope.stats.missing = $scope.stats.total - $scope.stats.attributed - $scope.stats.certified;
                $scope.stats.show = true;
            });
        };

        $scope.refreshStats = function () {
            getStats($scope.request.stats.productInShopSegment);
        }

        $scope.clearFilters = function () {
            initFilters();
            $scope.refresh();
        };

        $scope.refresh = function () {
            $scope.allSelected = false;
            $scope.request.offset = ($scope.currentPage - 1) * $scope.request.limit;

            $$ORM.repository('ProductInShop').list({
                name: $scope.request.productInShop.name
            }, {
                productInShopSegment_id: $scope.request.productInShopSegment ? $scope.request.productInShopSegment.id : null,
                productReference_reference: $scope.request.productReference.reference,
                product_certified: $scope.request.product.certified ? $scope.request.product.certified.id : null,
                shortIdOut: $scope.request.productInShop.shortIdOut,
                shop_shortId: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit, {
                isIdentifiedBy: true
            }).then(function (entities) {
                if (entities.length == 0 && $scope.currentPage > 1) {
                    $scope.currentPage = 1;
                    $scope.refresh();
                } else {
                    $scope.request.totalProducts = entities.totalResults;
                    $scope.request.totalPages = Math.floor(1 + (entities.totalResults / $scope.request.limit));
                    $scope.productInShops = entities;
                }
            });
        };

        /**
         * Triggered when the user change the page from the paginator
         */

        $scope.onPageChangeFromPaginator = function() {
            $scope.refresh();
        };


        $scope.list = function () {
            $scope.request.offset = 0;
            $scope.refresh();
        };

        $scope.isDeprecated = function (productInShop) {
            return productInShop.instantiates.certified === Product.CERTIFICATION_STATUS_DISCONTINUED.id;
        };

        $scope.isAttributed = function (productInShop) {
            return [
                Product.CERTIFICATION_STATUS_ATTRIBUTED.id,
                Product.CERTIFICATION_STATUS_ACCEPTED.id,
                Product.CERTIFICATION_STATUS_CERTIFIED.id,
                Product.CERTIFICATION_STATUS_PUBLISHED.id
            ].indexOf(productInShop.instantiates.certified) !== -1;
        };

        var filterSelectedProducts = function (productInShop) {
            // Check if we have selected multiple Products
            var selectedProductInShops = $scope.productInShops.filter(function (productInShop) {
                return productInShop.selected;
            });
            if (selectedProductInShops.length === 0) {
                selectedProductInShops = [productInShop];
            }
            return selectedProductInShops;
        };

        $scope.attribute = function (productInShop) {
            var selectedProductInShops = filterSelectedProducts(productInShop);

            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/productinshop/attribution-modal/attribution-modal.html',
                controller: 'ProductAttributionModalController',
                resolve: {
                    productInShops: function () { return selectedProductInShops; },
                    user: function () { return $scope.user; }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        };

        $scope.chase = function (productInShop) {
            var selectedProductInShops = filterSelectedProducts(productInShop);
            $log.warn("products", selectedProductInShops);

            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/productinshop/chase-modal/chase-modal.html',
                controller: 'ProductChaseModalController',
                resolve: {
                    productInShops: function () { return selectedProductInShops; },
                    user: function () { return $scope.user; }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        };

        $scope.show = function (productInShop) {
            var modalInstance = $modal.open({
                templateUrl: '/src/maker/product/show/preview-retailer/preview-retailer.html',
                controller: 'DashboardMakerProductShowRetailerPreviewController',
                size: 'lg',
                resolve: {
                    productReference: function () { return productInShop.isIdentifiedBy[0].reference; }
                }
            });
        };

        $scope.certifiedName = function (productInShop) {
            switch (productInShop.instantiates.certified) {
                case Product.CERTIFICATION_STATUS_DEFAULT.id:
                    return 'A contacter';
                case Product.CERTIFICATION_STATUS_REVIEWING.id:
                    return 'A contacter';
                case Product.CERTIFICATION_STATUS_ATTRIBUTED.id:
                    return 'Remplissage';
                case Product.CERTIFICATION_STATUS_ACCEPTED.id:
                    return 'Remplissage';
                case Product.CERTIFICATION_STATUS_CERTIFIED.id:
                    return 'Certifié';
                case Product.CERTIFICATION_STATUS_PUBLISHED.id:
                    return 'Certifié';
                case Product.CERTIFICATION_STATUS_DISCONTINUED.id:
                    return 'Déprécié';
                default:
                    return "";
            }
        };

        $scope.certifiedClass = function (productInShop) {
            switch (productInShop.instantiates.certified) {
                case Product.CERTIFICATION_STATUS_DEFAULT.id:
                    return 'label-danger';
                case Product.CERTIFICATION_STATUS_REVIEWING.id:
                    return 'label-danger';
                case Product.CERTIFICATION_STATUS_ATTRIBUTED.id:
                    return 'label-warning';
                case Product.CERTIFICATION_STATUS_ACCEPTED.id:
                    return 'label-primary';
                case Product.CERTIFICATION_STATUS_CERTIFIED.id:
                    return 'label-success';
                case Product.CERTIFICATION_STATUS_PUBLISHED.id:
                    return 'label-success';
                case Product.CERTIFICATION_STATUS_DISCONTINUED.id:
                    return 'label-default';
                default:
                    return "";
            }
        };

        $scope.isCertified = function (productInShop) {
            return productInShop.instantiates.certified === Product.CERTIFICATION_STATUS_CERTIFIED.id;
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        $scope.$watch('allSelected', function () {
            $scope.productInShops.map(function (pish) {
                pish.selected = !!$scope.allSelected;
            })
        });

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
                $scope.list();
            }
        });

        var initFilters = function () {
            $scope.request.productInShop = {
                name: null,
                shortIdOut: null
            };
            $scope.request.productInShopSegment = null;
            $scope.request.stats.productInShopSegment = null;
            $scope.request.productReference = {
                reference: null
            };
            $scope.request.product = {
                certifed: null
            };
        };

        permission.getUser().then(function (user) {
            initFilters();
            setPageFromUrl();
            $scope.user = user;
            var shopId = user.managesShop.map(function (shop) {
                return shop.id;
            })[0];
            $scope.request.shop.shortId = shopId;
            getSegment(shopId).then(function (segment) {
                // Make a first refresh based on the INCO products
                 if (!$routeParams.segment_id) {
                    $scope.request.productInShopSegment = segment;
                    $scope.request.stats.productInShopSegment = segment;
                    $scope.refresh();
                    $scope.refreshStats();
                }
            });
            if ($routeParams.segment_id) {
                $$ORM.repository('ProductInShopSegment').get($routeParams.segment_id).then(function (segment) {
                    $scope.request.productInShopSegment = segment;
                    $scope.request.stats.productInShopSegment = segment;
                    $scope.refresh();
                    $scope.refreshStats();
                });
            }
        });

    }
]);
