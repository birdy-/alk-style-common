"use strict";

angular.module('jDashboardFluxApp').controller('AccountActivationController', [
    '$scope', '$location', '$$ORM',
    function ($scope, $location, $$ORM) {

        // ------------------------------------------------------------------------
        // Params
        // ------------------------------------------------------------------------

        $scope.SUCCESS = 200;
        $scope.FAILED = 403;
        $scope.ALREADY_ACTIVATED = 409;

        $scope.token = null;
        $scope.username = null;
        $scope.loading = true;
        $scope.requestStatus = false;

        $scope.activateUser = function() {
            $$ORM.repository('User').method('Activate')($scope.username, $scope.token).then(function (response) {
                $scope.loading = false;
                $scope.requestStatus = $scope.SUCCESS;
            }, function(response) {
                $scope.loading = false;
                $scope.requestStatus = response.status;
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
