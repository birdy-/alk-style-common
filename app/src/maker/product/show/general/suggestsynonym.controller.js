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

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.ok = function () {
        var synonyms = [];
        for (var i = 0; i < $scope.synonyms.length; i++) {
            var synonym = $scope.synonyms[i];
            if (synonym.selected) {
                synonyms.push(synonym.name);
            }
        }
        $modalInstance.close(synonyms);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function () {
        if (product.status !== Product.STATUS_VALIDATED.id) {
            return;
        }
        if (!product.isConceptualizedBy.id) {
            return;
        }
        $$sdkCrud.ConceptShow(
            product.isConceptualizedBy.id
        ).success(function (response) {
            $scope.synonyms = [];
            response.data.aliases.forEach(function (synonym) {
                $scope.synonyms.push({
                    name: synonym,
                    selected: false
                });
            });
        }).error(function (response) {
            $window.alert("Erreur pendant la récupération des synonymes : " + response.data.data.message);
        });
    };
    init();
}]);
