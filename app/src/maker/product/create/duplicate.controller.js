'use_strict';

/**
 * Modal that allows the user to duplicate a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductDuplicationModalController', [
    '$scope', '$log', '$modalInstance', '$$sdkCrud', '$$sdkEtl', '$window', 'product', 'user',
    function ($scope, $log, $modalInstance, $$sdkCrud, $$sdkEtl, $window, product, user) {

    $scope.product = product;
    $scope.user = user;

    $scope.ok = function (product, reference) {
        var payload = {
            reference: reference,
            type: ProductReference.TYPE_EAN13.id
        };
        $$sdkEtl.ProductDuplicate(product.id, payload)
        .success(function (response) {
            $log.info(response);
        }).error(function (response) {
            $window.alert("Erreur pendant la duplication du produit : " + response.data.message);
        });
        $modalInstance.close(product);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
