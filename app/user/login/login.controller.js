'use strict';

/**
 * Controller for the Login form. For protection reasons, the login form is always
 * displayed at startup, and disappears once permissions have loaded. See the
 * authenticate directive for that matter.
 */
angular.module('jDashboardFluxApp').controller('LoginController', [
    '$scope', 'permission',
     function ($scope, permission) {

    $scope.login = null;
    $scope.password = null;
    $scope.message = null;

    $scope.submit = function() {
        permission.login($scope.login, $scope.password).error(function(response, status, headers, config){
            $scope.message = response.message || response.error_description;
        });
    };
}]);
