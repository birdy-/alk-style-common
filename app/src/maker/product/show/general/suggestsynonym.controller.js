'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductMarketingSynonymSuggestModalController', [
	'$scope', '$modalInstance', '$$sdkCrud', '$window', 'product',
	function ($scope, $modalInstance, $$sdkCrud, $window, product) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.synonyms = [];
    $scope.product = product;

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.ok = function () {
        var synonym;
        for (var i = 0; i < $scope.synonyms.length; i++) {
            synonym = $scope.synonyms[i];
            if (synonym.selected) {
                $scope.product.synonyms.push(synonym.name);
            }
        }
        $modalInstance.close($scope.product);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function() {
        if (product.status !== Product.STATUS_VALIDATED.id) {
            return;
        }
        if (!product.isConceptualizedBy.id) {
            return;
        }
        $$sdkCrud.ConceptShow(
            product.isConceptualizedBy.id
        ).success(function(response){
            $scope.synonyms = [];
            response.data.aliases.forEach(function(synonym){
                $scope.synonyms.push({
                    name: synonym,
                    selected: false
                });
            });
        }).error(function(response){
            $window.alert("Erreur pendant la récupération des synonymes : "+response.data.data.message);
        });
    };
    init();
}]);