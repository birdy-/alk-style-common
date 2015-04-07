'use_strict';

/**
 * Modal that allows the user to duplicate a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductDuplicationModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', 'products', 'user',
    function ($scope, $modalInstance, $$sdkCrud, $window, products, user) {

    $scope.products = products;
    $scope.user = user;

    $scope.ok = function () {
        for (var i=0 in products) {
            var product = products[i];
            $$sdkCrud.ProductDuplicate(product)
            .success(function (response) {

            }).error(function (response) {
                $window.alert("Erreur pendant la duplication du produit : " + response.data.message);
            });
        }
        $modalInstance.close(products);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
