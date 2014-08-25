'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMarketingController', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    $scope.fields = {
        serves: {
            laws: {
                'Article 27': "Le mode d'emploi d'une denrée alimentaire doit être indiqué de façon à permettre un usage approprié de cette denrée."
            },
            reglementations: {
                '1169': true
            },
            examples: [
                'ex : 2 pour "50cL contient 2 bols de 250mL"'
            ],
            specifications: [
                'Obligatoire si la déclaration nutritionnelle est fournie par portion et/ou unité de consommation.',
                'The total number of servings contained in the package.'
            ],
            gdsn: 'numberOfServingsPerPackage'
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
            templateUrl: '/src/maker/product/show/general/suggestname.html',
            controller: 'ProductMarketingNameSuggestModalController',
            resolve: {
                $$sdkCrud: function() {return $$sdkCrud; },
                product: function() {return $scope.product; }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };
    $scope.suggestSynonym = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/show/general/suggestsynonym.html',
            controller: 'ProductMarketingSynonymSuggestModalController',
            resolve: {
                $$sdkCrud: function() {return $$sdkCrud; },
                product: function() {return $scope.product; }
            }
        });

        modalInstance.result.then(function() {
        }, function() {
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
