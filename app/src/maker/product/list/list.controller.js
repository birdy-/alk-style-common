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
    '$scope', '$$sdkCrud', 'permission', '$$autocomplete',
    function ($scope, $$sdkCrud, permission, $$autocomplete) {

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
            console.warn("List Products : end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            console.warn("List Products : busy.");
            return;
        }
        var brand = $scope.request.product.isBrandedBy;
        if (!brand || !brand.id) {
            console.warn("List Products : no Brand set.");
            return;
        }
        console.log("List Products : chunk [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;

        // Remap parameters
        var certifieds = [];
        for (var key in $scope.request.product.certifieds) {
            if ($scope.request.product.certifieds[key] === true) {
                certifieds.push(key);
            }
        }
        $scope.request.product.certified = certifieds.join(',');

        $$sdkCrud.ProductList({
                namelegal: $scope.request.product.nameLegal,
            }, {
                isbrandedas_id: brand.id,
                isidentifiedby_reference: $scope.request.product.isIdentifiedBy.reference,
                certified: $scope.request.product.certified
            },
            {},
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
        $scope.scroll.offset = 0;
        $scope.scroll.stop = false;
        $scope.products = [];
        list();
    };

    $scope.$watch('request.product.isIdentifiedBy.reference', refresh);
    $scope.$watch('request.product.nameLegal', refresh);
    $scope.$watch('request.product.certifieds', refresh, true);

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function(user){
        // Load brand details
        $scope.request.product.isBrandedBy = user.managesBrand[0];
        $$sdkCrud.BrandShow($scope.request.product.isBrandedBy.id, function(response){
            $scope.request.product.isBrandedBy = response.data;
            $scope.request.product.isBrandedBy.text = response.data.name;
        });

        // Load all available brands
        user.managesBrand.forEach(function(brand){
            $$sdkCrud.BrandShow(brand.id).success(function(response){
                brand.name = response.data.name;
                brand.text = response.data.name;
            });
        });
        angular.extend($scope.select2brandOptions.data, user.managesBrand);

        // Load products
        list();
    });
}]);