'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductClaimModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window',
    function ($scope, $modalInstance, $$sdkCrud, $window) {

    $scope.productReference = productReference;

    $scope.ok = function () {
        $$sdkCrud.ProductReferenceClaim(
            $scope.productReferenece
        ).success(function(response){
            $modalInstance.close(response.data.identifies);
        }).error(function(response){
            $window.alert("Erreur pendant la certification du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
