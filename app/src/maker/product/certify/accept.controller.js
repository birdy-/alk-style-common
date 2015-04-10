'use_strict';

/**
 * Modal that allows the user to accept the responsability for a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductAcceptationModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', 'product', 'user', 'productSegment',
    function ($scope, $modalInstance, $$sdkCrud, $window, product, user, productSegment) {

    $scope.product = product;
    $scope.glns = productSegment.glns;
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
            $window.alert("Erreur pendant l'acceptation du produit : "+response.message);
        });
    };
    $scope.cancel = function () {
        // For now we shouldn't change the status
        // when someone try to cancel

        // $$sdkCrud.ProductCertify(
        //     $scope.product,
        //     Product.CERTIFICATION_STATUS_REVIEWING.id,
        //     "1169"
        // ).success(function(response){
        //     $scope.product.certified = response.data.certified;
        //     $modalInstance.dismiss('cancel');
        // }).error(function(response){
        //     $window.alert("Erreur pendant l'acceptation du produit : "+response.message);
        //     $modalInstance.dismiss('cancel');
        // });
    };

    var init = function () {
        if (product.isBrandedBy.id === 1){
            product.isBrandedBy = null;
        } else {
            product.isBrandedBy.text = product.isBrandedBy.name;
        }
    }

    init();
}]);
