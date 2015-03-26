'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp')
.controller('ProductCertificationModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', 'products', 'user',
    function ($scope, $modalInstance, $$sdkCrud, $window, products, user) {

    $scope.products = products;
    $scope.user = user;

    $scope.ok = function () {
        if (!$scope.user.email) {
            return;
        }
        for (var i=0 in products) {
            var product = products[i];
            product.certified = Product.CERTIFICATION_STATUS_CERTIFIED.id;
            $$sdkCrud.ProductCertify(
                product,
                Product.CERTIFICATION_STATUS_CERTIFIED.id,
                "1169"
            ).success(function (response) {
                product.certified = response.data.certified;
            }).error(function (response) {
                $window.alert("Erreur pendant la certification du produit : " + response.data.message);
            });
        }
        $modalInstance.close(products);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
