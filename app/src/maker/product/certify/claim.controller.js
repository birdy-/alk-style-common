'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductClaimModalController', [
    '$scope', '$modalInstance', '$$sdkCrud',
    function ($scope, $modalInstance, $$sdkCrud) {

    $scope.productReference = productReference;

    $scope.ok = function () {
        $$sdkCrud.ProductReferenceClaim(
            $scope.productReferenece,
        ).success(function(response){
            $modalInstance.close(response.data.identifies);
        }).error(function(response){
            alert("Erreur pendant la certification du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
