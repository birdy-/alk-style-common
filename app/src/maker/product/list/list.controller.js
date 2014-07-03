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
    // $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_DEFAULT.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_ACCEPTED.id] = true;
    $scope.request.product.certifieds[Product.CERTIFICATION_STATUS_CERTIFIED.id] = true;

    // Setup autocompletes
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {data:[], multiple: false, maximumSelectionSize: 1, minimumInputLength: 0});


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    var list = function() {
        if ($scope.scroll.stop) {
            $log.warn("List Products : end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            $log.warn("List Products : busy.");
            return;
        }
        var brand = $scope.request.product.isBrandedBy;
        if (!brand || !brand.id) {
            $log.warn("List Products : no Brand set.");
            return;
        }
        $log.log("List Products : chunk [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;

        // Remap parameters
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

        var filters = {};
        var queries = {};
        if ($scope.request.product.isIdentifiedBy.reference) {
            filters.isidentifiedby_reference = $scope.request.product.isIdentifiedBy.reference;
        } else if ($scope.request.product.nameLegal) {
            queries.namelegal = $scope.request.product.nameLegal;
            filters.certified = $scope.request.product.certified;
        } else {
            filters.isbrandedas_id = brand.id;
            filters.certified = $scope.request.product.certified;
        }

        $$sdkCrud.ProductList(queries, filters, {},
            $scope.scroll.offset,
            $scope.scroll.limit
        ).success(function(response){
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product, productInShop;
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
    }
    var refresh = function() {
        $log.log('Refresh Products');
        $scope.scroll.offset = 0;
        $scope.scroll.stop = false;
        $scope.products = [];
        list();
    };

    // $scope.$watch('request.product.isBrandedBy', refresh);
    $scope.$watch('request.product.isIdentifiedBy.reference', refresh);
    $scope.$watch('request.product.nameLegal', refresh);
    $scope.$watch('request.product.certifieds', refresh, true);

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function(user){
        // Load all available brands
        user.managesBrand.forEach(function(brand){
            $brandRepository.get(brand.id, function(brandCache){
                brandCache.text = brandCache.name;
            });
        });
        angular.extend($scope.select2brandOptions.data, user.managesBrand);

        // Load brand
        var brandId = $routeParams.id ? parseInt($routeParams.id) : null;
        if (brandId) {
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

        // Load products
        list();
    });

    $scope.$watch('request.product.isBrandedBy', function() {
        $log.log('[Request watcher] Brand modified');
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
}]);