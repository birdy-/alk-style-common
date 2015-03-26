'use_strict';

/**
 * Modal that allows the user to bulk edit lots of products.
 */
angular.module('jDashboardFluxApp')

.controller('ProductBulkEditWarningModalController', [
    '$scope', '$modalInstance', 'products', 'user',
    function ($scope, $modalInstance, products, user) {

    $scope.products = products;
    $scope.user = user;

    $scope.ok = function () {
        $modalInstance.close(products);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
