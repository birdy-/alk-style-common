'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('InfoClaimModalController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$autocomplete', 'permission', '$route', '$timeout', 'user', 'organization', 'redirect',
    function ($scope, $modalInstance, $$sdkAuth, $$autocomplete, permission, $route, $timeout, user, organization, redirect) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = user;
    $scope.organization = organization;
    $scope.redirect = redirect;
    $scope.errors = [];
    $scope.errors.unknown = false;
    $scope.errors.ok = true;

    $scope.verify = {
        'rcs': (organization.identifierLegal === undefined || organization.identifierLegal === '') ? true : false,
        'gln': (organization.ownsGLN === undefined || organization.ownsGLN[0].gln === '') ? true : false,
    }

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
        $scope.redirect();
    };
    /**
     * Called when the Product is new and is created
     */
    $scope.sendInformation = function () {
        console.log($scope.organization);
        $$sdkAuth.OrganizationUpdate($scope.organization).then(function (response) {
            console.log('Organization updated');
            $scope.cancel();
        });   
    }
}]);
