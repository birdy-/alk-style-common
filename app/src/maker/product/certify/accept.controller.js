'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductAcceptationModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', 'product', 'user',
    function ($scope, $modalInstance, $$sdkCrud, product, user) {

    $scope.product = product;
    $scope.user = user;
    $scope.ok = function () {
        $scope.product.certified = Product.CERTIFICATION_STATUS_ACCEPTED.id;
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_ACCEPTED.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.close($scope.product);
        }).error(function(response){
            alert("Erreur pendant l'acceptation du produit : "+response.message);
        });
    };
    $scope.cancel = function () {
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_REVIEWING.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.dismiss('cancel');
        }).error(function(response){
            alert("Erreur pendant l'acceptation du produit : "+response.message);
            $modalInstance.dismiss('cancel');
        });
    };
}]);
