'use strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopListController', [
    'permission', '$scope', '$$sdkCrud', '$modal', '$log', '$$ORM',
    function (permission, $scope, $$sdkCrud, $modal, $log, $$ORM) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.request = {
            productInShop: {
                name: null,
                shortIdOut: null
            },
            productInShopSegment: null,
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
            limit: 50
        };
        $scope.restrict = {};

        $scope.productInShops = [];


        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------
        var get = function (shopId) {
            return $$sdkCrud.StatisticsShow(['productinshop', 'product', 'productbrand'], shopId).then(function (response) {
                var productInShopStats = response.data.data.filter(function (stat) {
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

        $scope.refresh = function () {
            $$ORM.repository('ProductInShop').list({
                name: $scope.request.productInShop.name
            }, {
                productInShopSegment_id: $scope.request.productInShopSegment ? $scope.request.productInShopSegment.id : null,
                productReference_reference: $scope.request.productReference.reference,
                product_certified: $scope.request.product.certified,
                shortIdOut: $scope.request.productInShop.shortIdOut,
                shop_shortId: $scope.request.shop.shortId
            }, {}, $scope.request.offset, $scope.request.limit, {
                isIdentifiedBy: true
            }).then(function (entitys) {
                $scope.productInShops = entitys;
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

        $scope.isAttributed = function (productInShop) {
            return [
                Product.CERTIFICATION_STATUS_ATTRIBUTED.id,
                Product.CERTIFICATION_STATUS_ACCEPTED.id,
                Product.CERTIFICATION_STATUS_CERTIFIED.id,
                Product.CERTIFICATION_STATUS_PUBLISHED.id
            ].indexOf(productInShop.instantiates.certified) !== -1;
        };

        $scope.attribute = function (productInShop) {
            // Check if we have selected multiple Products
            var selectedProductInShops = $scope.productInShops.filter(function (productInShop) {
                return productInShop.selected;
            });
            if (selectedProductInShops.length === 0) {
                selectedProductInShops = [productInShop];
            }

            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/productinshop/attribution-modal.html',
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

        $scope.show = function (productInShop) {
            var modalInstance = $modal.open({
                templateUrl: '/src/retailer/productinshop/show-modal.html',
                controller: 'ProductShowModalController',
                size: 'lg',
                resolve: {
                    product: function () {
                        return productInShop.instantiates;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
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

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function (user) {
            $scope.user = user;
            var shopId = user.managesShop.map(function (shop) {
                return shop.id;
            })[0];
            $scope.request.shop.shortId = shopId;
            get(shopId);
        });

    }
]);
