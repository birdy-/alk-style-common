'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('BrandClaimModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', '$log', 'permission', '$routeParams', '$$sdkAuth', '$$autocomplete',
    function ($scope, $modalInstance, $$sdkCrud, $window, $log, permission, $routeParams, $$sdkAuth, $$autocomplete) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = null;
    $scope.errors = [];
    $scope.errors.unknown = false;
    $scope.errors.ok = true;
    $scope.request = {};
    $scope.select2BrandOptions = $$autocomplete.getOptions('brand', {multiple: false});

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    /**
     * Called when the Product is new and is created
     */
    $scope.create = function() {
        $scope.sendClaim();
    };

    /**
     * Called when something when wrong
     */
    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
    };

    $scope.brandNotInList = function () {
        $scope.errors.unknown = !$scope.errors.unknown;
    };

    $scope.sendRequestBrand = function() {
        $$sdkAuth.UserClaimProductBrandCreate($scope.request.selectedBrand.name, '1', $scope.request.selectedBrand.id).then(function () {$scope.errors.ok = false});
    };

    $scope.sendRequestNewBrand = function() {
        $$sdkAuth.UserClaimProductBrandCreate($scope.request.createdBrand, '0', 1).then(function () {$scope.errors.ok = false});
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
    });

}]);
