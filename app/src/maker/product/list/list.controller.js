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
    '$scope', '$$sdkCrud', 'permission', '$$autocomplete', '$routeParams', '$brandRepository', '$log',
    function ($scope, $$sdkCrud, permission, $$autocomplete, $routeParams, $brandRepository, $log) {

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
    $scope.brandHierarchy = [];
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ATTRIBUTED.id] = false;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_PUBLISHED.id] = true;

    // Setup autocompletes
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {data:[], multiple: false, maximumSelectionSize: 1, minimumInputLength: 0, allowClear: true});

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
        var brand = $scope.request.product.isBrandedBy;
        if (!brand || !brand.id) {
            $log.warn("[findByBrand] no Brand set.");
            return;
        }
        $log.log("[findByBrand] "+brand.id);
        var filters = {
            isbrandedby_id: brand.id,
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

    $scope.$watch('request.product.isIdentifiedBy.reference', refresh);
    $scope.$watch('request.product.nameLegal', refresh);
    $scope.$watch('request.product.certifieds', refresh, true);
    $scope.$watch('request.product.isBrandedBy', function() {
        $log.log('[Request watcher] Brand modified');
        $scope.request.product.isIdentifiedBy.reference = null;
        refresh();
        var brand = $scope.request.product.isBrandedBy;
        var brandHierarchy = [];
        while (brand && permission.isAllowed('Brand', brand.id)) {
            brandHierarchy.push(brand);
            brand = brand.isSubBrandOf;
        }
        brandHierarchy.reverse();
        $scope.brandHierarchy = brandHierarchy;
    }, true);

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function() {
        $scope.scroll.busy = true;
        permission.getUser().then(function(user){
            // Load all available brands
            user.managesBrand.forEach(function(brand){
                $brandRepository.get(brand.id, function(brandCache){
                    brandCache.text = brandCache.name;
                });
            });
            angular.extend($scope.select2brandOptions.data, user.managesBrand);
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
            if (brandId) {
                $log.log('[Init] Initializing screen with isBrandedBy = ' + brandId);
                if (permission.isAllowed('Brand', brandId)) {
                    $scope.request.product.isBrandedBy = $brandRepository.lazy(brandId);
                } else {
                    alert('You are not allowed to view Brand');
                    return;
                }
            }
            if (!$scope.request.product.isBrandedBy) {
                $scope.request.product.isBrandedBy = user.managesBrand[0];
            }
            list();
            return;
        });
    };

    init();
}]);