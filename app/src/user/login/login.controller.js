'use strict';

/**
 * Controller for the Login form. For protection reasons, the login form is always
 * displayed at startup, and disappears once permissions have loaded. See the
 * authenticate directive for that matter.
 */
angular.module('jDashboardFluxApp').controller('LoginController', [
    '$scope', 'permission', '$location',
     function ($scope, permission, $location) {

    $scope.login = null;
    $scope.password = null;
    $scope.message = null;

    $scope.submit = function() {
        permission.login(
            $scope.login,
            $scope.password
        ).then(function(response){
            // Choose which view to redirect to depending on user
            permission.getUser().then(function(user){
                // We first check whether I have multiple shops in case :
                // - I am a Shop owner but I have also retailer Brands
                if (user.managesShop.length > 0) {
                    $location.path('/retailer/activity');
                    return;
                }
                // The default behaviour is showing the brand view for multiple cases :
                // - I just registered and I have no Brands nor Shops
                $location.path('/maker/activity');
            });
        }, function(response, status, headers, config){
            // Login failure : bad password, bad login...
            console.log(response);
            $scope.message = response.data.message
                          || response.data.error_description
                          || "Erreur lors de l'authentification.";
        });
    };
}]);