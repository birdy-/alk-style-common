'use strict';


angular.module('jDashboardFluxApp').controller('MakerHeaderController', [
    '$scope', 'permission', '$location', '$modal',
    function ($scope, permission, $location, $modal) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.logout = function() {
        permission.logout();
        $scope.user = null;
        $location.path('/');
    };

    $scope.subscribe = function(message){
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/home/support.html',
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
    var init = function() {
        permission.getUser().then(function (user) {
            $scope.user = user;
            //asume that a user has only one organisation
            $scope.isAdmin = permission.isAdmin(user.belongsTo[0].id);
            $scope.organization = user.belongsTo[0];
        });
    };
    init();
}]);
