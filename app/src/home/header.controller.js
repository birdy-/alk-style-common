'use strict';

angular.module('jDashboardFluxApp').controller('HeaderController', [
    '$scope', 'permission', '$location',
    function ($scope, permission, $location) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.logged = false;
    $scope.user = {};
    $scope.brand = {};

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.logout = function () {
        permission.logout();
        $scope.logged = false;
        $scope.user = null;
        $scope.brand = {};
        $location.path('/');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function () {
        permission.getUser().then(function (user) {
            $scope.logged = true;
            $scope.user = user;
        });
    };
    init();
}]);
