'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductMarketingNameSuggestModalController', [
	'$scope', '$modalInstance', '$$sdkCrud', '$window', 'product',
	function ($scope, $modalInstance, $$sdkCrud, $window, product) {

    $scope.productInShops = [];

    $$sdkCrud.ProductIsInstantiatedBy(
        product.id
    ).success(function(response){
        $scope.productInShops = response.data.isInstantiatedBy;
    }).error(function(response){
        $window.alert("Erreur pendant la récupération du produit : "+response.data.data.message);
    });

    $scope.active = function(productInShop) {
        return [1, 2, 7, 10, 65, 66, 67].indexOf(productInShop.isSoldBy.id) !== -1;
    };

    $scope.ok = function () {
        $modalInstance.close($scope.product);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);