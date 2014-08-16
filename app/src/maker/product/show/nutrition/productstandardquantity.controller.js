/**
 * Modal that allows the user to create a PSQ.
 */
angular.module('jDashboardFluxApp').controller('ProductStandardQuantityModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$$sdkMl', '$$CommonUnitRepository', 'productStandardQuantity',
    function ($scope, $modalInstance, $$sdkCrud, $$sdkMl, $$CommonUnitRepository, productStandardQuantity) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.psq = productStandardQuantity;

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.parse = function() {
        if (!$scope.psq.name) {
            return;
        }
        $$sdkMl.ProductPackagingParse($scope.psq.name).then(function(response){
            var data = response.data.data;
            $scope.psq.quantity = data.quantityNormalized;
            $scope.psq.isMeasuredBy = $$CommonUnitRepository.lazy(data.isMeasuredBy.id);
        });

    };
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


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

}]);
