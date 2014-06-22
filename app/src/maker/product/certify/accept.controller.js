/**
 * Modal that allows the user to accept the responsability for a given product.
 */
var ProductAcceptationModalController = function ($scope, $modalInstance, $$sdkCrud, product, user) {
    $scope.product = product;
    $scope.user = user;
    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        }
        $scope.product.accepted = true;
        $$sdkCrud.ProductCertify(
            $scope.product,
            Product.CERTIFICATION_STATUS_ACCEPTED.id,
            "1169"
        ).success(function(response){
            $scope.product.certified = response.data.certified;
            $modalInstance.close($scope.product);
        }).error(function(response){
            alert("Erreur pendant l'acceptation du produit : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};