'use strict';

angular.module('jDashboardFluxApp').controller('HomeController', [
    '$scope', 'permission', '$modal',
    function ($scope, permission, $modal) {

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
    permission.getUser().then(function(user) {
        $scope.user = user;
    });

}]);
