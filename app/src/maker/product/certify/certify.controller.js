'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductCertificationModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', 'product', 'user',
    function ($scope, $modalInstance, $$sdkCrud, product, user) {
    
    $scope.product = product;
    $scope.user = user;
    
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        };

        $scope.product.certified = 3;
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_CERTIFIED.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.close($scope.product);
        }).error(function(response){
            alert("Erreur pendant la certification du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
