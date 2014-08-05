'use strict';

angular.module('jDashboardFluxApp').controller('HomeCtrl', [
    '$scope', 'permission', '$location', '$modal', '$http', '$window',
    function ($scope, permission, $location, $modal, $http, $window) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.subscribe = function(message){
        var modalInstance = $modal.open({
            templateUrl: '/src/home/contact.html',
            controller: 'ContactController',
            resolve: {
                user: function () {
                    return $scope.user;
                },
                message: function() {
                    return message
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
    permission.getUser().then(function(user) {
        $scope.user = user;
    });

}]);
