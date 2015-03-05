"use strict";

/**
 * Modal that allows the user to register on the mailing list
 */
angular.module('jDashboardFluxApp').controller('OrganizationUserAddController', [
    '$scope', '$modalInstance', '$$sdkAuth', '$$ORM', '$$autocomplete', '$window', 'permission', 'organization', 'brands', 'administrators', 'currentUser',
    function ($scope, $modalInstance, $$sdkAuth, $$ORM, $$autocomplete, $window, permission, organization, brands, administrators, currentUser) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    
    $scope.isHelpOpened = false;
    $scope.isBrandsOpened = false;
    $scope.administrators = administrators;
    $scope.brands = brands;
    $scope.selectedBrands = {};
    
    organization.text = organization.nameLegal;
    $scope.invitation = {
        organization: organization,
        lastname: null,
        firstname: null,
        username: null,
        jobTitle: null,
        phoneNumber: null,
        brands: [],
        isAdmin: false,
        permissions: ['user'],
        confirmation: false
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
           $scope.invitation.permissions.push('admin');


       var payload = {
            organization: {
                id:  $scope.invitation.organization.id
            },
            username: $scope.invitation.username,
            lastname: $scope.invitation.lastname,
            firstname: $scope.invitation.firstname,
            jobTitle: $scope.invitation.jobTitle,
            phonenumber: $scope.invitation.phoneNumber,
            permissions: $scope.invitation.permissions.join(','),
            confirmation: $scope.invitation.confirmation,
            user_id: currentUser.id
       };
       if ($scope.invitation.brands.length > 0)
            payload.brands = $scope.invitation.brands.join(',');

        $$sdkAuth.UserInvite(payload, {
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
