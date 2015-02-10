"use strict";

/**
 * Modal that allows the user to register on the mailing list
 */
angular.module('jDashboardFluxApp').controller('OrganizationUserAddController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$ORM', '$$autocomplete', '$window', 'permission', 'organization', 'brands', 'administrators',
    function ($scope, $modalInstance, $$sdkAuth, $$ORM, $$autocomplete, $window, permission, organization, brands, administrators) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.administrators = administrators;
    organization.text = organization.nameLegal;
    $scope.brands = brands;
    $scope.select2organizationOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
    $scope.invitation = {
        username: null,
        organization: organization,
        permission: 'user'
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.submit = function () {
        if (!$scope.invitation.username) {
            $window.alert("Merci de préciser un email.");
            return;
        }

        $$sdkAuth.UserInvite($scope.invitation, {
        }).then(function(){
            $modalInstance.close($scope.invitation);
        }, function(response){
            var message = '.';
            if (response && response.data && response.data.message) {
                message = ' : '+ response.data.message + '.';
            }
            $window.alert("Problème lors de l'invitation" + message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

}]);
