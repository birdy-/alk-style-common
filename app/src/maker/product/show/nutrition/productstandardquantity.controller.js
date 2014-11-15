'use_strict';

/**
 * Modal that allows the user to create a PSQ.
 */
angular.module('jDashboardFluxApp').controller('ProductStandardQuantityModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$$sdkMl', '$$ORM', '$window', 'productStandardQuantity',
    function ($scope, $modalInstance, $$sdkCrud, $$sdkMl, $$ORM, $window, productStandardQuantity) {

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
            $scope.psq.isMeasuredBy = $$ORM.repository('CommonUnit').lazy(data.isMeasuredBy.id);
        });

    };
    $scope.ok = function () {
        if (!$scope.psq.isMeasuredBy
        || !$scope.psq.isMeasuredBy.id
        || !$scope.psq.quantity
        || !$scope.psq.name) {
            $window.alert("Merci de compléter tous les champs.");
            return;
        }
        $$sdkCrud.ProductStandardQuantityCreate(
            $scope.psq
        ).success(function(response){
            $scope.psq = $scope.psq.fromJson(response.data);
            $modalInstance.close($scope.psq);
        }).error(function(response){
            var message = '.';
            if (response && response.data && response.data.message) {
                message = ' : '+ response.data.message + '.';
            }
            $window.alert("Erreur pendant la création de la ProductStandardQuantity : "+message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

}]);
