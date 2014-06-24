/**
 * Modal that allows the user to certify a given product.
 */
var ProductStandardQuantityModalController = function ($scope, $modalInstance, $$sdkCrud, productStandardQuantity) {
    $scope.psq = productStandardQuantity;
    $scope.commonUnits =
    $scope.ok = function () {
        $$sdkCrud.ProductStandardQuantityCreate(
            $scope.psq
        ).success(function(response){
            $scope.psq = $scope.psq.fromJson(response.data);
            $modalInstance.close($scope.psq);
        }).error(function(response){
            alert("Erreur pendant la création de la ProductStandardQuantity : "+response.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
