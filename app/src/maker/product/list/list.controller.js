'use strict';

/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductListController', [
    '$rootScope', '$scope', '$$sdkCrud', 'permission', '$routeParams', '$$ORM', '$log', '$location', '$window', 'URL_CDN_MEDIA',
    function ($rootScope, $scope, $$sdkCrud, permission, $routeParams, $$ORM, $log, $location, $window, URL_CDN_MEDIA) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.request = $rootScope.navigation.maker.request;
    $scope.products = $scope.request.products || [];
    $scope.allBrands = [];
    $scope.brands = [];
    $scope.segmentIds = [];

    // `$scope.request` is retrieved from the rootScope by inheritance
    if (!$scope.request.initialized) {
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;

        $scope.request.offset = 0;
        $scope.request.limit = 24;
        $scope.request.busy = false;

        $scope.request.initialized = true;
    }
    $scope.options = {
        'data-drag-enabled': false
    };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    var list = function () {
        // Collect parameters
        var certifieds = [];
        for (var key in $scope.request.product.certifieds) {
            if ($scope.request.product.certifieds[key] === true) {
                certifieds.push(key);
            }
        }
        // If no option is selected do not make any call
        if (certifieds.length === 0) {
            return;
        }
        $scope.request.product.certified = certifieds.join(',');

        if ($scope.request.product.isIdentifiedBy.reference) {
            return findByReference();
        } else if ($scope.request.product.nameLegal) {
            return findByName();
        } else {
            return findByBrand();
        }
    };

    var findByReference = function () {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            brands.push($scope.allBrands[i].id);
        }
        brands = brands.join(',');

        var filters = {
            isbrandedby_id: brands,
            isidentifiedby_reference: $scope.request.product.isIdentifiedBy.reference
        };

        return find({}, filters);
    };

    var findByBrand = function (filters) {
        var filters = filters || {};
        var brands = [];
        for (var i = 0; i < $scope.brands.length; i++) {
            if ($scope.brands[i].active === true) {
                brands.push($scope.brands[i].id);
            }
        }
        if (brands.length === 0) {
            $log.warn("Product List Controller : no <Brand> set in findByBrand.");
            return;
        }
        brands = brands.join(',');

        $log.log("Product List Controller : listing by <Brand> " + brands);
        var filters = angular.extend({
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        }, filters);
        return find({}, filters);
    };

    var findByName = function () {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        if (brands.length === 0) {
            $log.warn("Product List Controller : no <Brand> set in findByName.");
            return;
        }
        brands = brands.join(',');

        var filters = {
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        };
        var queries = {
            namelegal: $scope.request.product.nameLegal
        };
        $log.log("Product List Controller : listing by name '" + queries.nameLegal + "' in " + brands);
        return find(queries, filters);
    };

    var find = function (queries, filters) {
        filters.productsegment_id = $scope.segmentIds.join(',');
        $log.log("Product List Controller : listing [" + $scope.request.offset + "-" + ($scope.request.offset + $scope.request.limit) + "]" );
        $scope.request.busy = true;
        $$sdkCrud.ProductList(queries, filters, {},
            $scope.request.offset,
            $scope.request.limit,
            { isIdentifiedBy: 1 }
        ).success(function (response) {
            $scope.products = [];
            var product;
            for (var i = 0; i < response.data.length; i ++) {
                product = hydrateProduct(response.data[i]);
                $scope.products.push(product);
            }

            $location.search('offset', $scope.request.offset);
            $scope.request.products = $scope.products;
            $scope.request.busy = false;

        }).error(function (response) {
            $window.alert("Erreur pendant la récupération des Produits.");
        });
    };

    $scope.prev = function () {
        $scope.request.busy = true;
        $scope.request.offset = $scope.request.offset - $scope.request.limit;
        list();
    };

    $scope.next = function () {
        $scope.request.busy = true;
        $scope.request.offset = $scope.request.offset + $scope.request.limit;
        list();
    };

    var refresh = function () {
        $log.log("Product List Controller : refresh <Products>.");
        $scope.products = [];
        $scope.request.products = $scope.products;
        $scope.request.offset = 0;
        list();
    };

    var propagate = function (brand, value) {
        if (!brand._subBrands) {
            return;
        }
        for (var i = 0; i < brand._subBrands.length; i++) {
            brand._subBrands[i].active = value;
            propagate(brand._subBrands[i], value);
        }
    };

    $scope.refreshBrand = function (brand) {
        propagate(brand, brand.active);
        refresh();
    };

    $scope.show = function (product, index) {
        $scope.request.scrollAnchor = index;
        $location.path('/maker/product/' + product.isIdentifiedBy[0].reference + '/data/general');
    };

    $scope.$watch('request.product.isIdentifiedBy.reference', function(newVal, oldVal) {
        if (oldVal !== newVal) refresh();
    });
    $scope.$watch('request.product.nameLegal', function(newVal, oldVal) {
        if (oldVal !== newVal) refresh();
    });
    $scope.$watch('request.product.certifieds', function(newVal, oldVal) {
        if (oldVal !== newVal) refresh();
    }, true);

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    var init = function () {
        $scope.request.busy = true;
        permission.getUser().then(function (user) {
            // Load all available brands
            var brandIds = user.managesBrand.map(function (brand) {
                return brand.id;
            }).join(',');
            $$ORM.repository('Brand').list({}, {id: brandIds}, {}, 0, 100, {subbrands: 1}).then(function (brands) {
                brands.forEach(function (brand) {
                    brand._subBrands = [];
                    brand.isSubBrandOf._subBrands = [];
                });
                brands.forEach(function (brand) {
                    brand.root = true;
                    var subBrandIndex = brand.isSubBrandOf._subBrands.indexOf(brand);
                    // We need to check if the subbrand is in the $scope.brands because of lazy load
                    if ($scope.brands.indexOf(brand.isSubBrandOf._subBrands[subBrandIndex]) !== -1 && subBrandIndex !== -1) {
                        return;
                    }
                    brand.isSubBrandOf._subBrands.push(brand);
                    if (brand.isSubBrandOf.allowed) {
                        brand.root = false;
                    } else {
                        $scope.brands.push(brand);
                    }
                });
            });
            $scope.allBrands = user.managesBrand;
            $scope.request.busy = false;

            // Load by reference
            var reference = $routeParams.reference;
            if (reference) {
                $log.log("Product List Controller : initializing screen with isIdentifiedBy=" + reference);
                $scope.request.product.isIdentifiedBy.reference = reference;
                list();
                return;
            }

            // Load brand
            var brandId = $routeParams.id ? parseInt($routeParams.id, 10) : null;
            var active = false;
            if (brandId) {
                $log.log("Product List Controller : initializing screen with isBrandedBy=" + brandId);
                if (user.isAllowed('Brand', brandId)) {
                    $$ORM.repository('Brand').lazy(brandId).active = true;
                } else {
                    $window.alert("You are not allowed to view Brand");
                    return;
                }
            }

            // For now, no filter on ProductSegments, just use them for permission
            // The if clause can be removed, it's just for backward compatibility
            if (user.managesProductSegment) {
                $scope.segmentIds = user.managesProductSegment.map(function (segment) {
                    return segment.id;
                });
            }

            list();
            return;
        });
    };

    var hydrateProduct = function (data) {
        var product = new Product().fromJson(data);
        product.urlPictureOriginal = URL_CDN_MEDIA + '/product/' + product.id + '/picture/packshot/256x256.png?' + Math.random() * 100000000;
        return product;
    };

    init();
}]);
