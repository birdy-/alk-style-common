'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductMarketingNameSuggestModalController', [
	'$scope', '$modalInstance', '$$sdkCrud', 'product',
	function ($scope, $modalInstance, $$sdkCrud, product) {

    $scope.productInShops = [];

    $$sdkCrud.ProductIsInstantiatedBy(
        product.id
    ).success(function(response){
        $scope.productInShops = response.data.isInstantiatedBy;
    }).error(function(response){
        alert("Erreur pendant la récupération du produit : "+response.data.data.message);
    });

    $scope.ok = function () {
        $modalInstance.close($scope.product);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);