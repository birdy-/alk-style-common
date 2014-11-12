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
    '$scope', '$$sdkCrud', 'permission', '$routeParams', '$$ORM', '$log', '$location', '$window', 'URL_CDN_MEDIA',
    function ($scope, $$sdkCrud, permission, $routeParams, $$ORM, $log, $location, $window, URL_CDN_MEDIA) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.products = $scope.request.products || [];
    $scope.scroll = {
        offset: 0,
        limit: 24,
        stop: false,
        busy: false
    };
    $scope.allBrands = [];
    $scope.brands = [];

    // `$scope.request` is retrieved from the rootScope by inheritance
    if (!$scope.request.initialized) {
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
        $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DISCONTINUED.id] = false;
        $scope.request.initialized = true;
    }
    $scope.options = {
        'data-drag-enabled': false
    };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    var list = function () {
        if ($scope.scroll.stop) {
            $log.warn("Product List Controller : scroll end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            $log.log("Product List Controller : busy listing <Products>.");
            return;
        }
        $log.log("Product List Controller : listing <Products>.");

        // Collect parameters
        var certifieds = [];
        for (var key in $scope.request.product.certifieds) {
            if ($scope.request.product.certifieds[key] === true) {
                certifieds.push(key);
            }
        }
        if (certifieds.length === 0) {
            certifieds = [2];
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
        var queries = {};
        var filters = {
            reference: $scope.request.product.isIdentifiedBy.reference
        };
        $log.log("Product List Controller : listing by reference="+filters.reference);
        $scope.scroll.busy = true;
        $$sdkCrud.ProductReferenceList(queries, filters, {},
            $scope.scroll.offset,
            $scope.scroll.limit
        ).success(function (response) {
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product;
            $log.log("Product List Controller : " + response.data.length + " results found.");
            for (var i = 0; i < response.data.length; i ++) {
                product = hydrateProduct(response.data[i].identifies);
                $scope.products.push(product);
            }

            $scope.request.products = $scope.products;
            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
        });
    };

    var findByBrand = function () {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        if (brands.length === 0) {
            $log.warn("Product List Controller : no <Brand> set in findByBrand.");
            return;
        }
        brands = brands.join(',');

        $log.log("Product List Controller : listing by <Brand> " + brands);
        var filters = {
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        };
        return find({}, filters);
    };

    var findByName = function () {
        var brand = $scope.request.product.isBrandedBy;
        if (!brand || !brand.id) {
            $log.warn("Product List Controller : no <Brand> set in findByName.");
            return;
        }
        var filters = {
            isbrandedby_id: brand.id,
            certified: $scope.request.product.certified
        };
        var queries = {
            namelegal: $scope.request.product.nameLegal
        };
        $log.log("Product List Controller : listing by name '" + queries.nameLegal + "' in "+brand.id);
        return find(queries, filters);
    };

    var find = function (queries, filters) {
        $log.log("Product List Controller : listing [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;
        $$sdkCrud.ProductList(queries, filters, {},
            $scope.scroll.offset,
            $scope.scroll.limit,
            {isIdentifiedBy: 1}
        ).success(function (response) {
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product;
            for (var i = 0; i < response.data.length; i ++) {
                product = hydrateProduct(response.data[i]);
                $scope.products.push(product);
            }

            $scope.request.products = $scope.products;
            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
        }).error(function (response) {
            $window.alert("Erreur pendant la récupération des Produits.");
        });
    };

    $scope.more = function () {
        list();
    };

    var refresh = function () {
        $log.log("Product List Controller : refresh <Products>.");
        $scope.scroll.offset = 0;
        $scope.scroll.stop = false;
        $scope.products = [];
        $scope.request.products = $scope.products;
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

    $scope.show = function (product) {
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
        $scope.scroll.busy = true;
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
            $scope.scroll.busy = false;

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
            if (!active) {
                user.managesBrand[0].active = true;
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
