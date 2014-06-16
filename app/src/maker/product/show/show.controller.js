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

    $scope.tabs = {
        wine: {visible: true /*false*/},
    };
    $scope.prediction = {
        visible: false,
        concept: null,
        tab: "wine", // null,
        correct: null,
    };

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
    $scope.select2countryOptions = $$autocomplete.getOptionAutocompletes('country', {maximumSelectionSize: 1, multiple: false});
    $scope.select2regionOptions = $$autocomplete.getOptionAutocompletes('region', {maximumSelectionSize: 1, multiple: false});
    $scope.select2appellationOptions = $$autocomplete.getOptionAutocompletes('appellation', {maximumSelectionSize: 1, multiple: false});
    $scope.select2varietalOptions = $$autocomplete.getOptionAutocompletes('varietal', {multiple: true});
    $scope.select2glassOptions = $$autocomplete.getOptionAutocompletes('glass', {maximumSelectionSize: 1, multiple: false});
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {maximumSelectionSize: 1});
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {maximumSelectionSize: 1, multiple: false});
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
        product.hasVarietal = [];
        product.accepted = true;
        //product.accepted = false;
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
        $scope.completeness = computeScore($scope.product, $scope.productForm);
        inferProduct($scope.product, $scope.productForm);
    }, true);

    $scope.submit = function() {
        alert('Vous n\'êtes pas autorisé à effectuer cette opération');
        return;
        $$sdkCrud.ProductUpdate($scope.product, function(response) {});
    };

    $scope.certify = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certification.html',
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
            templateUrl: '/src/maker/product/acceptation.html',
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

    $scope.predict = function(product) {
        $scope.prediction.visible = true;
        $scope.prediction.concept = {
            name: 'vin rouge',
        };
        $scope.prediction.tab = 'wine';
    };
    $scope.verify = function() {
        if ($scope.prediction.correct) {
            $scope.tabs[$scope.prediction.tab].visible = true;
        }
    };
    $scope.partners = function(productInShop) {
        return [1, 2, 7, 66, 67, 10].indexOf(productInShop.isSoldBy.id) !== -1;
    }

    $scope.deleteReference = function(reference) {
        alert('Vous n\'êtes pas autorisé à effectuer cette opération');
    };
    $scope.newProductFromReference = function(reference) {
        alert('Vous n\'êtes pas autorisé à effectuer cette opération');
    };
    $scope.sendNotification = function(productInShop) {
        alert('Vous n\'êtes pas autorisé à effectuer cette opération');
    };
}]);



var computeScore = function(product, productForm) {
    var total = 0, ok = 0;
    for (var key in productForm) {
        if (!productForm.hasOwnProperty(key)
        || angular.isUndefined(productForm[key].$error)
        || angular.isUndefined(productForm[key].$error.required)) {
            continue;
        }
        total += 1;
        if (productForm[key].$error['required'] == false) {
            ok += 1;
        }
    }
    return ok * 100 / total;
};

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
};

var inferProduct = function(product, productForm) {
    var ADDITIVE_REGEX = new RegExp('E[0-9]+');
    var additives = [];
    var composition = [];
    var item;
    if (product.composition) {
        for (var i = 0; i < product.composition.length; i++) {
            item = product.composition[i];
            if (ADDITIVE_REGEX.test(item.text)) {
                additives.push(item);
            } else {
                composition.push(item);
            }
        }
    }
    if (product.additives) {
        for (var i = 0; i < product.additives.length; i++) {
            item = product.additives[i];
            if (ADDITIVE_REGEX.test(item.text)) {
                additives.push(item);
            } else {
                additives.push(item);
            }
        }
        product.composition = composition;
        product.additives = additives;
    }
    if (product.composition) {
        for (var i = 0; i < product.composition.length; i++) {
            var text = product.composition[i].text;
            if (text.indexOf('lait') !== -1) {
                product.hasLactose = true;
            }
            if (text.indexOf('saindoux') !== -1){
                product.hasSaindoux = true;
            }
            if (text.indexOf('huile de palme' ) !== -1){
                product.hasOilPalm = true;
                product.hasRiskOilPalm = true;
            }
            if (text.indexOf('huile de colza' ) !== -1){
                product.hasOilCoprah = true;
            }
            if (text.indexOf('huile de coco' ) !== -1){
                product.hasOilCoconut = true;
            }
            if (text.indexOf('beurre' ) !== -1){
                product.hasButter = true;
            }
            if (text.indexOf('huile de tournesol' ) !== -1){
                product.hasOilSunflower = true;
            }
            if (text.indexOf('huile d\'olive' ) !== -1){
                product.hasOilOlive = true;
            }
            if (text.indexOf('crème') !== -1 || text.indexOf('creme') !== -1 || text.indexOf('crême') !== -1){
                product.hasCream = true;
            }
            if (text.indexOf('huile de pépins de raisin' ) !== -1){
                product.hasOilGrapeSeed = true;
            }
            if (text.indexOf('huile de pépins de raisin' ) !== -1){
                product.hasOilCanola = true;
            }
        }
    }
    if (product.isPack === false) {
        product.factorPA = 1;
    }
    product.packaging = readablePackaging(product);
    return product;
}

