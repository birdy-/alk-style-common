"use strict";

angular.module('jDashboardFluxApp').controller('AccountActivationController', [
    '$scope', '$$sdkAuth', '$location', '$http', '$window', '$routeParams', '$$ORM',
    function ($scope, $$sdkAuth, $location, $http, $window, $routeParams, $$ORM) {

        // ------------------------------------------------------------------------
        // Params
        // ------------------------------------------------------------------------
        $scope.token = null;
        $scope.username = null;
        $scope.loading = true;
        $scope.success = false;

        $scope.activateUser = function() {
            $$sdkAuth.UserActivate($scope.username, $scope.token).success(function (response) {
                $scope.success = true;
            }).error(function(response) {
                $scope.success = false;
            }).finally(function() {
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
