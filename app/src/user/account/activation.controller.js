"use strict";

angular.module('jDashboardFluxApp').controller('AccountActivationController', [
    '$scope', '$location', '$$ORM',
    function ($scope, $location, $$ORM) {

        // ------------------------------------------------------------------------
        // Params
        // ------------------------------------------------------------------------
        $scope.token = null;
        $scope.username = null;
        $scope.loading = true;
        $scope.success = false;

        $scope.activateUser = function() {
            $$ORM.repository('User').method('Activate')($scope.username, $scope.token).then(function (response) {
                $scope.success = true;
                $scope.loading = false;
            }, function(response) {
                $scope.success = false;
                $scope.loading = false;
            });
        };

        // ------------------------------------------------------------------------
        // Navigation
        // ------------------------------------------------------------------------
        $scope.goHome = function() {
            $location.path($location.url($location.path('/')));
        };


        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------

        $scope.init = function() {
            $scope.token    = $location.search()['token'];
            $scope.username = $location.search()['username'];

            if ($scope.username === 'undefined' || $scope.token === 'undefined')
                $scope.goHome()

            $scope.activateUser();
        };

        $scope.init();

}]);
