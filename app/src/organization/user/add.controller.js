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
    
    $scope.isHelpOpened = false;
    $scope.isBrandsOpened = false;
    $scope.administrators = administrators;
    $scope.brands = brands;
    $scope.selectedBrands = {};
    
    organization.text = organization.nameLegal;
    $scope.select2organizationOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
    $scope.invitation = {
        organization: organization,
        lastname: null,
        firstname: null,
        username: null,
        jobTitle: null,
        phoneNumber: null,
        brands: [],
        isAdmin: false,
        permission: 'user'
    };
    $scope.confirmation = null;


    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.submit = function () {
        var alertMessage = "Ces champs sont manquants ou invalides:";
        if (!$scope.invitation.lastname || !$scope.invitation.firstname 
                || !$scope.invitation.username || !$scope.invitation.jobTitle 
                || !$scope.invitation.phoneNumber) {
            alertMessage += (!$scope.invitation.lastname ? "\n+ Nom" : ""); 
            alertMessage += (!$scope.invitation.firstname ? "\n+ Prénom" : ""); 
            alertMessage += (!$scope.invitation.username ? "\n+ Email" : ""); 
            alertMessage += (!$scope.invitation.jobTitle ? "\n+ Poste" : ""); 
            alertMessage += (!$scope.invitation.phoneNumber ? "\n+ Numéro de Téléphone" : ""); 
            $window.alert(alertMessage);
            return;
        }
        if ($scope.confirmation !== $scope.invitation.username) {
            $window.alert("Confirmation d'email invalide");
            return;
        }

        if ($scope.invitation.isAdmin)
            $scope.invitation.permission = 'admin';

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
