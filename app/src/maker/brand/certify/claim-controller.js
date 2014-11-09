'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('BrandClaimModalController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$autocomplete', 'permission',
    function ($scope, $modalInstance, $$sdkAuth, $$autocomplete, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = null;
    $scope.errors = [];
    $scope.errors.unknown = false;
    $scope.errors.ok = true;
    $scope.request = {};
    $scope.select2BrandOptions = $$autocomplete.getOptions('brand', {multiple: false});

    var claimRequestType = {
        createBrand: '0',
        manageBrand: '1'
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    /**
     * Called when the Product is new and is created
     */
    $scope.create = function () {
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

    $scope.sendRequestBrand = function () {
        $$sdkAuth.UserClaimProductBrandCreate($scope.request.selectedBrand.name, claimRequestType.manageBrand, $scope.request.selectedBrand.id).then(function () {
            $scope.errors.ok = false;
        });
    };

    $scope.sendRequestNewBrand = function () {
        $$sdkAuth.UserClaimProductBrandCreate($scope.request.createdBrand, claimRequestType.createBrand, 1).then(function () {
            $scope.errors.ok = falsel
        });
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
    });

}]);
