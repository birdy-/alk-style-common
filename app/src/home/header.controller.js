'use strict';

angular.module('jDashboardFluxApp').controller('HeaderController', [
    '$scope', 'permission', '$location', '$modal',
    function ($scope, permission, $location, $modal) {

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

    $scope.subscribe = function (message) {
        var modalInstance = $modal.open({
            templateUrl: '/src/home/contact.html',
            controller: 'ContactController',
            resolve: {
                user: function () {
                    return $scope.user;
                },
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
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
