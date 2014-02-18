'use strict';

/**
 * Modal that allows the user to certify a given product.
 */
var ProductCertificationModalController = function ($scope, $modalInstance, product, user) {
    $scope.product = product;
    $scope.user = user;
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        }
        $scope.product.certified = true;
        $modalInstance.close($scope.product);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

/**
 * Modal that allows the user to accept the responsability for a given product.
 */
var ProductAcceptationModalController = function ($scope, $modalInstance, product, user) {
    $scope.product = product;
    $scope.user = user;
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        }
        $scope.product.accepted = true;
        $modalInstance.close($scope.product);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};



/**
 * Page that displays all the elements that describe a given Brand.
 *
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $$sdkCrud    [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} permission)  [description]
 * @return {[type]}              [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location) {

    $scope.select2productCompositionOptions = {
        allowClear:                 true,
        multiple:                   true,
        formatResult:               $$autocomplete.formatResult,
        formatResultCssClass:       $$autocomplete.formatResultCssClass,
        formatSelection:            $$autocomplete.formatSelection,
        formatSelectionCssClass:    $$autocomplete.formatSelectionCssClass,
        createSearchChoice: function(term, data) {
            if ($(data).filter(function() {
                return this.text.localeCompare(term)===0;
            }).length===0) {
                return {id:term, text:term, _type: 'Concept'};
            }
        },
        data: []
    };
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {maximumSelectionSize: 1});
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {maximumSelectionSize: 1});
    $scope.user = {};
    $scope.product = {
        id: $routeParams.id
    };
    $scope.completeness = 0;

    $$sdkCrud.ProductShow($scope.product.id, true, function(response){
        var product = response.data;
        if (product.composition !== null) {
            var composition = product.composition.split(', ');
            product.composition = [];
            for (var i = 0; i < composition.length; i++) {
                product.composition.push({
                    text: composition[i],
                    id: i,
                    _type: 'Concept'
                });
            }
        } else {
            product.composition = [];
        }
        if (product.additives !== null) {
            var additives = product.additives.split(', ');
            product.additives = [];
            for (var i = 0; i < additives.length; i++) {
                product.additives.push({
                    text: additives[i],
                    id: i,
                    _type: 'Concept'
                });
            }
        } else {
            product.additives = [];
        }
        if (product.allergens !== null) {
            var allergens = product.allergens.split(',');
            product.allergens = [];
            for (var i = 0; i < allergens.length; i++) {
                product.allergens.push({
                    text: allergens[i],
                    id: i,
                    _type: 'Concept'
                });
            }
        } else {
            product.allergens = [];
        }
        if (product.amountStarch !== null) {
            product.hasStarch = true;
        }
        if (product.factorPA > 1) {
            product.isSplitable = true;
        }
        if (product.factorFUPA > 1) {
            product.isSplitable = true;
        }
        product.isMeasuredBy.text = product.isMeasuredBy.name;
        product.packaging = readablePackaging(product);
        product.madeOf = [];
        //product.accepted = true;
        product.accepted = false;
        product.certified = false;

        $scope.product = product;

        $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
            maximumSelectionSize: 1,
        }, {
            filter_brand_id: $scope.product.isProducedBy.id
        });

        if ($scope.product.accepted === false) {
            $scope.accept();
        }
    });

    var isEmpty = function (value) {
        return typeof(value) === 'undefined' || value === '' || value === null || value !== value;
    }
    $scope.check = function(field) {
        var classes = {};
        if ($scope.productForm[field].$invalid) {
            if (isEmpty($scope.productForm[field].$viewValue)) {
                classes['has-warning'] = true;
            } else {
                classes['has-error'] = true;
            }
        }
        if ($scope.productForm[field].$valid) {
            if (isEmpty($scope.productForm[field].$viewValue)) {
                // Empty fields that are not required should not be displayed green
            } else {
                classes['has-success'] = true;
            }
        }
        return classes;
    }

    // Computation of the salt-equivalence
    $scope.$watch('product.qtySalt', function() {
        if (isEmpty($scope.product.amoutNa)) {
            $scope.product.amoutNa = $scope.product.qtySalt / 2.5;
        };
    });
    $scope.$watch('product.amountNa', function() {
        if (isEmpty($scope.product.qtySalt)) {
            $scope.product.qtySalt = $scope.product.amountNa * 2.5;
        };
    });
    $scope.$watch('product', function() {
        var total = 0, ok = 0;
        for (var key in $scope.productForm) {
            if (!$scope.productForm.hasOwnProperty(key)
            || angular.isUndefined($scope.productForm[key].$error)
            || angular.isUndefined($scope.productForm[key].$error.required)) {
                continue;
            }
            total += 1;
            if ($scope.productForm[key].$error['required'] == false) {
                ok += 1;
            }
        }
        if ($scope.product.composition) {
            var ADDITIVE_REGEX = new RegExp('E[0-9]+');
            for (var i = 0; i < $scope.product.composition.length; i++) {
                var text = $scope.product.composition[i].text;
                if (text.indexOf('lait') !== -1) {
                    $scope.product.hasLactose = true;
                }
                if (text.indexOf('saindoux') !== -1){
                    $scope.product.hasSaindoux = true;
                }
                if (text.indexOf('huile de palme' ) !== -1){
                    $scope.product.hasOilPalm = true;
                    $scope.product.hasRiskOilPalm = true;
                }
                if (text.indexOf('huile de colza' ) !== -1){
                    $scope.product.hasOilCoprah = true;
                }
                if (text.indexOf('huile de coco' ) !== -1){
                    $scope.product.hasOilCoconut = true;
                }
                if (text.indexOf('beurre' ) !== -1){
                    $scope.product.hasButter = true;
                }
                if (text.indexOf('huile de tournesol' ) !== -1){
                    $scope.product.hasOilSunflower = true;
                }
                if (text.indexOf('huile d\'olive' ) !== -1){
                    $scope.product.hasOilOlive = true;
                }
                if (text.indexOf('crème') !== -1 || text.indexOf('creme') !== -1 || text.indexOf('crême') !== -1){
                    $scope.product.hasCream = true;
                }
                if (text.indexOf('huile de pépins de raisin' ) !== -1){
                    $scope.product.hasOilGrapeSeed = true;
                }
                if (text.indexOf('huile de pépins de raisin' ) !== -1){
                    $scope.product.hasOilCanola = true;
                }
                if (ADDITIVE_REGEX.test($scope.product.composition[i].text)) {
                    $scope.product.additives.push($scope.product.composition[i]);
                }
            }
        }
        $scope.completeness = ok * 100 / total;
        if ($scope.product.isPack === false) {
            $scope.product.factorPA = 1;
        }
        $scope.product.packaging = readablePackaging($scope.product);
    }, true);

    var readablePackaging = function(product) {
        var packaging = '';
        if (product.factorPA && product.packagingName) {
            packaging += product.factorPA + ' ' + product.packagingName + '(s) ';
            packaging += ' de '
        }
        if (product.isSplitable && product.factorFUPA && product.unitFridge) {
            packaging += product.factorFUPA + ' ' + product.unitFridge + '(s) ';
        }
        if (!product.isMeasuredBy || !product.isMeasuredBy.name) {
            return '';
        }
        packaging += ' de '
        packaging += product.factorSIFU + ' ' + product.isMeasuredBy.name;
        return packaging;
    }

    $scope.submit = function() {
        alert('You do not have the necessary privileges to update this product.');
        return;
        $$sdkCrud.ProductUpdate($scope.product, function(response) {});
    };

    $scope.certify = function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/maker/product/certification.html',
            controller: ProductCertificationModalController,
            resolve: {
                product: function () {
                    return $scope.product;
                },
                user: function () {
                    return $scope.user;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.accept = function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/maker/product/acceptation.html',
            controller: ProductAcceptationModalController,
            resolve: {
                product: function () {
                    return $scope.product;
                },
                user: function () {
                    return $scope.user;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $location.path('/flux/maker/product');
        });
    };

}]);


/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @param  {[type]} $routeParams) [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductListCtrl', [
    '$scope', '$$sdkCrud', 'permission', '$routeParams',
    function ($scope, $$sdkCrud, permission, $routeParams) {

    $scope.request = {
        product: {
            name: ''
        },
        productReference: {
            value: ''
        }
    };
    $scope.products = [];
    $scope.brand = {};
    $scope.user = {};
    $scope.scroll = {
        offset: 0,
        limit: 18,
        stop: false,
        busy: false,
    };

    permission.getUser().then(function (user) {
        $scope.user = user;
        $scope.brand = user.ownsBrand[0];
        $$sdkCrud.BrandShow($scope.brand.id, function(response){
            $scope.brand = response.data;
            list();
        });
    });

    var list = function() {
        if ($scope.scroll.stop) {
            console.warn("List Products : end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            console.warn("List Products : busy.");
            return;
        }
        var brand = $scope.brand;
        if (!brand || !brand.id) {
            console.error("List Products : no Brand set.");
            return;
        }
        console.log("List Products : chunk [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;
        $$sdkCrud.ProductList({
                    product_name: $scope.request.product.name,
                }, {
                    brand_id: brand.id,
                    productreference_value: $scope.request.productReference.value
                },
                {},
                $scope.scroll.offset,
                $scope.scroll.limit,
                function(response){
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product, productInShop;
            for (var i = 0; i < response.data.length; i ++) {
                product = response.data[i];
                product.status = Math.round(Math.random(), 0);
                if (product.status == 1) {
                    product.completeness = 100;
                } else {
                    product.completeness = Math.round(Math.random() * 100);
                }
                $scope.products.push(product);
            }
            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
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

    $scope.$watch('request.productReference.value', refresh);
    $scope.$watch('request.product.name', refresh);
}]);