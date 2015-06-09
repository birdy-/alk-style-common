'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPackagingController', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission','$window', '$$sdkMl', '$analytics',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission, $window, $$sdkMl, $analytics) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
        maximumSelectionSize: 1, multiple: false,
        initSelection: function (el, fn) {} // https://github.com/angular-ui/ui-select2/issues/186
    });
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {
        maximumSelectionSize: 1, multiple: false, allowClear: false,
        initSelection: function (el, fn) {} // https://github.com/angular-ui/ui-select2/issues/186
    });

    $scope.ML_DEFAULT = new Constant(0, "DEFAULT", "The Product has not been considered for review yet");
    $scope.ML_FOUND = new Constant(1, "DEFAULT", "The Product has not been considered for review yet");
    $scope.ML_NOT_FOUND = new Constant(2, "DEFAULT", "The Product has not been considered for review yet");

    $scope.packagingValidator = {
        validStateSIFU: $scope.ML_DEFAULT.id,
        factorSIFUSuggest: '',
        validStateFUPA: $scope.ML_DEFAULT.id,
        factorFUPASuggest: '',
        validate: function () {
            return ($scope.product.factorFUPA * $scope.product.factorSIFU) === $scope.product.quantityNormalized;
        }
    }

    $scope.typePackagings = [
        Product.TYPEPACKAGING_EACH,
        Product.TYPEPACKAGING_PACK_HOMO,
        Product.TYPEPACKAGING_PACK_HETERO,
        Product.TYPEPACKAGING_CASE_HOMO,
        Product.TYPEPACKAGING_CASE_HETERO,
        Product.TYPEPACKAGING_PALLET_HOMO,
        Product.TYPEPACKAGING_PALLET_HETERO
    ];

    $scope.checkPackaging = function (field) {
        var classes = {};
        if ($scope.packagingValidator.validate() == false && field == 'factorFUPA' &&
            $scope.packagingValidator.validStateFUPA != $scope.ML_DEFAULT.id) {
            classes['has-warning'] = true;
        }
        else if ($scope.packagingValidator.validate() == false && field == 'factorSIFU' &&
            $scope.packagingValidator.validStateSIFU != $scope.ML_DEFAULT.id) {
            classes['has-warning'] = true;
        }
        else {
            if (field == 'factorSIFU')
                $scope.packagingValidator.validStateSIFU = $scope.ML_DEFAULT.id;
            if (field == 'factorFUPA')
                $scope.packagingValidator.validStateFUPA = $scope.ML_DEFAULT.id;
            classes['has-success'] = true;
        }
        return classes;
    }

    $scope.acceptPackagingSuggestion = function (field) {
        if (field == 'factorFUPA') {
            $scope.product.factorFUPA = $scope.packagingValidator.factorFUPASuggest;
        }
        else if (field == 'factorSIFU') {
            $scope.product.factorSIFU = $scope.packagingValidator.factorSIFUSuggest;
        }
    }

    $scope.reparseProductPackaging = function () {
        if (typeof $scope.product.packaging === 'undefined' && typeof $scope.product.namePublicLong == 'undefined')
            return;
        $$sdkMl.ProductPackagingParse(
            $scope.product.packaging,
            $scope.product.namePublicLong,
            $scope.product.isMeasuredBy.id).success(function (response) {
            var packaging = response.data;
            if ((packaging.factorSIFU * packaging.factorFUPA) == $scope.product.quantityNormalized) {
                if ($scope.product.factorSIFU != packaging.factorSIFU) {
                    $scope.packagingValidator.factorSIFUSuggest = packaging.factorSIFU;
                    $scope.packagingValidator.validStateSIFU = $scope.ML_FOUND.id;
                } else {
                    $scope.packagingValidator.validStateSIFU = $scope.ML_DEFAULT.id;
                }
                if ($scope.product.factorFUPA != packaging.factorFUPA) {
                    $scope.packagingValidator.factorFUPASuggest = packaging.factorFUPA;
                    $scope.packagingValidator.validStateFUPA = $scope.ML_FOUND.id;
                } else {
                    $scope.packagingValidator.validStateFUPA = $scope.ML_DEFAULT.id;
                }
                $analytics.eventTrack('Product Profile Packaging ML SuggestionDisplayed');
            } else {
                $scope.packagingValidator.validStateSIFU = $scope.ML_NOT_FOUND.id;
                $scope.packagingValidator.validStateFUPA = $scope.ML_NOT_FOUND.id;
            }
        });
    }

    $scope.typePromotionals = function () {
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

    $scope.isSplitable = function () {
        if ($scope.product.factorFUPA > 1) {
            $scope.product.isSplitable = true;
            return true;
        }
        return $scope.product.isSplitable;
    };

    $scope.addIsMadeOf = function () {
        var pimop = new ProductIsMadeOfProduct();
        $scope.product.isMadeOf.push(pimop);
    };
    $scope.deleteIsMadeOf = function (pimop) {
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

    $scope.checkDeactivateSplitable = function () {
        if ($scope.product.unitFridge) {
            $window.alert('Veuillez effacer les champs de subdivisions ci-dessous pour sélectionner cette option');
            $scope.product.isSplitable = true;
        } else {
            $scope.product.isSplitable = false;
            $scope.product.factorFUPA = 0;
            $scope.product.factorSIFU = 0;
        }
    };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    $scope.$watch('product', function () {
        // Load the isMadeOf relations
        if ($scope.product.isMadeOf) {
            $scope.product.isMadeOf.forEach(function (isMadeOf) {
                var product = isMadeOf.item;
                if (!product
                || !product.id
                || product.text) {
                    return;
                }
                $$sdkCrud.ProductShow(product.id).success(function (response) {
                    angular.extend(product, response.data);
                    product.text = product.nameLegal;
                });
            });
        }
        // Load the isDerivedFrom relation
        if ($scope.product.isDerivedFrom
        && $scope.product.isDerivedFrom.id) {
            $scope.product.isDerivable = true;
            $$sdkCrud.ProductShow($scope.product.isDerivedFrom.target.id).success(function (response) {
                angular.extend($scope.product.isDerivedFrom.target, response.data);
                $scope.product.isDerivedFrom.target.text = response.data.nameLegal;
            });
        }

        // Update autocompletes
        if ($scope.product.isBrandedBy) {
            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1, multiple: false,
                initSelection: function (el, fn) {}
            }, {
                filter_isbrandedby_id: $scope.product.isBrandedBy.id,
                filter_certified: '1,2,3'
            });
        }

        if($scope.product.factorFUPA > 1
        || $scope.product.unitFridge) {
            $scope.product.isSplitable = true;
        } else if (typeof $scope.product.isSplitable === 'undefined') {
            // Init the isSplitable value if we do not have the above at init
            $scope.product.isSplitable = false;
        }

        if ($scope.packagingValidator.validate() == false)
            $scope.reparseProductPackaging();
    }, true);
}]);
