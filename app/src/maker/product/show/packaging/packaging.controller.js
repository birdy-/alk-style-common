'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPackagingController', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
        maximumSelectionSize: 1, multiple: false,
        initSelection: function(el, fn) {} // https://github.com/angular-ui/ui-select2/issues/186
    });
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {
        maximumSelectionSize: 1, multiple: false, allowClear: false,
        initSelection: function(el, fn) {} // https://github.com/angular-ui/ui-select2/issues/186
    });

    $scope.typePackagings = [
        Product.TYPEPACKAGING_EACH,
        Product.TYPEPACKAGING_PACK_HOMO,
        Product.TYPEPACKAGING_PACK_HETERO,
        Product.TYPEPACKAGING_CASE_HOMO,
        Product.TYPEPACKAGING_CASE_HETERO,
        Product.TYPEPACKAGING_PALLET_HOMO,
        Product.TYPEPACKAGING_PALLET_HETERO
    ];
    $scope.typePromotionals = function() {
        if (!$scope.product._type) {
            return [
                Product.TYPEPROMOTIONAL_DEFAULT,
                Product.TYPEPROMOTIONAL_BONUSPACK,
                Product.TYPEPROMOTIONAL_FREECOMPONENTS,
                Product.TYPEPROMOTIONAL_MULTIPACK,
                Product.TYPEPROMOTIONAL_COMBINATIONPACK,
                Product.TYPEPROMOTIONAL_SAMPLE,
                Product.TYPEPROMOTIONAL_FREEGIFTATTACHED,
                Product.TYPEPROMOTIONAL_SPECIALPACKAGING,
                Product.TYPEPROMOTIONAL_SPECIALPRICE
            ];
        }
        if ($scope.product.isTypePackagingEach()) {
            return [
                Product.TYPEPROMOTIONAL_DEFAULT,
                Product.TYPEPROMOTIONAL_BONUSPACK,
                Product.TYPEPROMOTIONAL_FREECOMPONENTS,
                Product.TYPEPROMOTIONAL_SAMPLE,
                Product.TYPEPROMOTIONAL_FREEGIFTATTACHED,
                Product.TYPEPROMOTIONAL_SPECIALPACKAGING,
                Product.TYPEPROMOTIONAL_SPECIALPRICE
            ];
        } else if ($scope.product.isTypePackagingMultiple()) {
            return [
                Product.TYPEPROMOTIONAL_DEFAULT,
                Product.TYPEPROMOTIONAL_BONUSPACK,
                Product.TYPEPROMOTIONAL_FREECOMPONENTS,
                Product.TYPEPROMOTIONAL_MULTIPACK,
                Product.TYPEPROMOTIONAL_COMBINATIONPACK,
                Product.TYPEPROMOTIONAL_SPECIALPRICE
            ];
        } else {
            return [];
        }
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    $scope.isSplitable = function() {
        if ($scope.product.factorFUPA > 1) {
            $scope.product.isSplitable = true;
            return true;
        }
        return $scope.product.isSplitable;
    };

    $scope.addIsMadeOf = function() {
        var pimop = new ProductIsMadeOfProduct();
        $scope.product.isMadeOf.push(pimop);
    };
    $scope.deleteIsMadeOf = function(pimop) {
        var index = -1;
        for (var i = 0; i < $scope.product.isMadeOf.length; i++) {
            if ($scope.product.isMadeOf[i] === pimop) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            $scope.product.isMadeOf.splice(index, 1);
        }
    };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    $scope.$watch('product', function(){
        // Load the isMadeOf relations
        if ($scope.product.isMadeOf) {
            $scope.product.isMadeOf.forEach(function(isMadeOf){
                var product = isMadeOf.item;
                if (!product
                || !product.id
                || product.text) {
                    return;
                }
                $$sdkCrud.ProductShow(product.id).success(function(response){
                    angular.extend(product, response.data);
                    product.text = product.nameLegal;
                });
            });
        }
        // Load the isDerivedFrom relation
        if ($scope.product.isDerivedFrom
        && $scope.product.isDerivedFrom.id) {
            $scope.product.isDerivable = true;
            $$sdkCrud.ProductShow($scope.product.isDerivedFrom.target.id).success(function(response){
                angular.extend($scope.product.isDerivedFrom.target, response.data);
                $scope.product.isDerivedFrom.target.text = response.data.nameLegal;
            });
        }

        // Update autocompletes
        if ($scope.product.isBrandedBy) {
            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1, multiple: false,
                initSelection: function(el, fn) {}
            }, {
                filter_isbrandedby_id: $scope.product.isBrandedBy.id,
                filter_certified: '1,2,3'
            });
        }

        if($scope.product.factorFUPA > 1
        || $scope.product.unitFridge) {
            $scope.product.isSplitable = true;
        }
    }, true);
}]);
