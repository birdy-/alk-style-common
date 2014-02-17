'use strict';

angular.module('jDashboardFluxApp').controller('LoginController', [
    '$scope', '$$sdkCrud', 'authService', '$location',
    function ($scope, $$sdkCrud, authService, $location) {

    $scope.login = '';
    $scope.password = '';
    $scope.rememberme = '';

    $scope.authenticated = false;

    $scope.message = '';

    $scope.submit = function() {
        $$sdkCrud.UserLogin($scope.login, $scope.password, $scope.rememberme).success(function(response){
            $scope.message = response.message;
            if (!response.authenticated) {
                $scope.message = 'Erreur lors de l\'authentification';
                return;
            }
            $scope.authenticated = true;
            authService.loginConfirmed();
            $location.path($location.path());
        });
    };

    $scope.isReset = false;
    $scope.toggleReset = function () {
        $scope.isReset = true;
    };

    $scope.reset = function () {
        $scope.message = "Please email contact@alkemics.com";
    }
}]);