'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMarketingCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    $scope.fields = {
        serves: {
            laws: {
                'Article 27': "Le mode d'emploi d'une denrée alimentaire doit être indiqué de façon à permettre un usage approprié de cette denrée."
            },
            reglementations: {
                '1169': true,
            },
            examples: [
                'ex : 2 pour "50cL contient 2 bols de 250mL"'
            ],
            specifications: [
                'Obligatoire si la déclaration nutritionnelle est fournie par portion et/ou unité de consommation.',
                'The total number of servings contained in the package.',
            ],
            gdsn: 'numberOfServingsPerPackage',
        }
    };

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2synonymsOptions = {
        multiple: true,
        simple_tags: true,
        tags: []
    };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.suggestName = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/show/marketing/suggestname.html',
            controller: 'ProductMarketingNameSuggestModalController',
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };
    $scope.suggestSynonym = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/show/marketing/suggestsynonym.html',
            controller: 'ProductMarketingSynonymSuggestModalController',
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };

    // ------------------------------------------------------------------------
    // Event listening
    // ------------------------------------------------------------------------
    $scope.$watch('product', function(){
        if ($scope.product.serves) {
            $scope.servesExact = 1;
        } else if ($scope.product.servesText) {
            $scope.servesExact = 2;
        }
    }, true);
}]);


var inferProduct = function(product, productForm) {
    if (product.composition) {
        var text = product.composition;
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
        if (text.indexOf('glucose' ) !== -1){
            product.hasGlucose = true;
        }
    }
    if (product.amountStarch !== null) {
        product.hasStarch = true;
    }

    return product;
}

var isEmpty = function (value) {
    return typeof(value) === 'undefined' || value === '' || value === null || value !== value;
};