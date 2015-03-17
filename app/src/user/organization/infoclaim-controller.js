'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('InfoClaimModalController', [
    '$scope', '$modalInstance', '$$sdkAuth', 'user', 'organization', 'redirect',
    function ($scope, $modalInstance, $$sdkAuth, user, organization, redirect) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = user;
    $scope.organization = organization;
    $scope.redirect = redirect;
    $scope.errors = [];
    $scope.errors.unknown = false;
    $scope.errors.ok = true;
    $scope.helper = {
        'rcs': false,
        'gln': false
    }

    $scope.verify = {
        'rcs': (!organization.identifierLegal || typeof organization.identifierLegal === 'undefined' || organization.identifierLegal === '') ? true : false,
        'gln': (!organization.ownsGLN || typeo  f organization.ownsGLN[0] === 'undefined' || organization.ownsGLN[0].gln === '') ? true : false,
    }

    if ($scope.verify.gln) {
        $scope.organization.claimGLN = [];
        $scope.organization.claimGLN.push(new GLN('added'));
    }

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------


    $scope.toogleHelper = function (helper) {
        $scope.helper[helper] = !$scope.helper[helper];
    };

    $scope.cancel = function () {
        // The claim request was sent above.
        $modalInstance.dismiss('cancel');
        $scope.redirect();
    };
    /**
     * Called when the Product is new and is created
     */
    $scope.sendInformation = function () {
        if ($scope.organization.claimGLN && $scope.organization.claimGLN[0].gln != '') {
            $$sdkAuth.UserClaimGlnCreate({'gln': $scope.organization.claimGLN[0].gln, 'organization_id': $scope.organization.id}).then(function (response) {});
        }
        console.log($scope.organization);
        $$sdkAuth.OrganizationUpdate($scope.organization).then(function (response) {
            // console.log('Organization updated');
            $scope.cancel();
        });
    }
}]);
