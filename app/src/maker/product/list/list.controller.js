'use strict';

/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductListCtrl', [
    '$scope', '$$sdkCrud', 'permission', '$$autocomplete', '$routeParams', '$$BrandRepository', '$log',
    function ($scope, $$sdkCrud, permission, $$autocomplete, $routeParams, $$BrandRepository, $log) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.request = {
        product: {
            name: '',
            isBrandedBy: null,
            certified: [],
            certifieds: {},
            isIdentifiedBy: {
                reference: null
            },
        }
    };
    $scope.products = [];
    $scope.scroll = {
        offset: 0,
        limit: 24,
        stop: false,
        busy: false,
    };
    $scope.allBrands = [];
    $scope.brands = [];
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;
    $scope.options = {
        'data-drag-enabled': false,
    };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    var list = function() {
        $log.log('List');
        if ($scope.scroll.stop) {
            $log.warn("List Products : end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            $log.warn("List Products : busy.");
            return;
        }

        // Collect parameters
        var certifieds = [];
        for (var key in $scope.request.product.certifieds) {
            if ($scope.request.product.certifieds[key] === true) {
                certifieds.push(key);
            }
        }
        if (certifieds.length == 0) {
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

    var findByReference = function() {
        var queries = {};
        var filters = {
            reference: $scope.request.product.isIdentifiedBy.reference
        };
        $log.log('[findByReference] '+filters.reference);
        $scope.scroll.busy = true;
        $$sdkCrud.ProductReferenceList(queries, filters, {},
            $scope.scroll.offset,
            $scope.scroll.limit
        ).success(function(response){
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product;
            $log.log(response.data.length + ' results found.');
            for (var i = 0; i < response.data.length; i ++) {
                product = new Product().fromJson(response.data[i].identifies);
                $scope.products.push(product);
            }

            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
        });
    };

    var findByBrand = function() {
        var brands = [];
        for (var i = 0; i < $scope.allBrands.length; i++) {
            if ($scope.allBrands[i].active === true) {
                brands.push($scope.allBrands[i].id);
            }
        }
        $log.warn($scope.allBrands);
        if (brands.length == 0) {
            $log.warn("[findByBrand] no Brand set.");
            return
        }
        brands = brands.join(',');

        $log.log("[findByBrand] "+brands);
        var filters = {
            isbrandedby_id: brands,
            certified: $scope.request.product.certified
        };
        return find({}, filters);
    };

    var findByName = function() {
        var brand = $scope.request.product.isBrandedBy;
        if (!brand || !brand.id) {
            $log.warn("[findByName] no Brand set.");
            return;
        }
        $log.log("[findByName] "+brand.id);
        var filters = {
            isbrandedby_id: brand.id,
            certified: $scope.request.product.certified
        };
        var queries = {
            namelegal: $scope.request.product.nameLegal
        }
        return find(queries, filters);
    };

    var find = function(queries, filters) {
        $log.log("[Find] chunk [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;
        $$sdkCrud.ProductList(queries, filters, {},
            $scope.scroll.offset,
            $scope.scroll.limit
        ).success(function(response){
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product;
            for (var i = 0; i < response.data.length; i ++) {
                product = new Product().fromJson(response.data[i]);
                $scope.products.push(product);
            }
            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
        }).error(function(response){
            alert('Erreur pendant la récupération des Produits.');
        });
    };

    $scope.more = function() {
        list();
    };
    var refresh = function() {
        $log.log('Refresh Products');
        $scope.scroll.offset = 0;
        $scope.scroll.stop = false;
        $scope.products = [];
        list();
    };
    var propagate = function(brand, value) {
        if (!brand._subBrands) {
            return;
        }
        for (var i = 0; i < brand._subBrands.length; i++) {
            brand._subBrands[i].active = value;
            propagate(brand._subBrands[i], value);
        }
    };

    $scope.refreshBrand = function(brand){
        propagate(brand, brand.active);
        refresh();
    };

    $scope.$watch('request.product.isIdentifiedBy.reference', refresh);
    $scope.$watch('request.product.nameLegal', refresh);
    $scope.$watch('request.product.certifieds', refresh, true);

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function() {
        $scope.scroll.busy = true;
        permission.getUser().then(function(user){
            // Load all available brands
            user.managesBrand.forEach(function(brand){
                $$BrandRepository.get(brand.id).then(function(brand) {
                    brand.root = true;
                    if (typeof(brand.isSubBrandOf._subBrands) === 'undefined') {
                        brand.isSubBrandOf._subBrands = [];
                    }
                    if (brand.isSubBrandOf._subBrands.indexOf(brand) !== -1) {
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
                $log.log('[Init] Initializing screen with isIdentifiedBy = ' + reference);
                $scope.request.product.isIdentifiedBy.reference = reference;
                list();
                return;
            }

            // Load brand
            var brandId = $routeParams.id ? parseInt($routeParams.id) : null;
            var active = false;
            if (brandId) {
                $log.log('[Init] Initializing screen with isBrandedBy = ' + brandId);
                if (permission.isAllowed('Brand', brandId)) {
                    $$BrandRepository.lazy(brandId).active = true;
                } else {
                    alert('You are not allowed to view Brand');
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

    init();
}]);