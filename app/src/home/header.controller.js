'use strict';


angular.module('jDashboardFluxApp').controller('HeaderCtrl', [
    '$scope', 'permission', '$$sdkCrud', '$location', '$modal',
    function ($scope, permission, $$sdkCrud, $location, $modal) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.logged = false;
    $scope.user = {};
    $scope.brand = {};

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.logout = function() {
        permission.logout();
        $scope.logged = false;
        $scope.user = null;
        $scope.brand = {};
        $location.path('/');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function() {
        permission.getUser().then(function (user) {
            $scope.logged = true;
            $scope.user = user;
            $scope.brand = user.managesBrand[0];
            $scope.brand.picture = {
                logo: 'https://smedia.alkemics.com/brand/' + $scope.brand.id + '/picture/logo/original.png',
            };
        });
    };
    init();

    var subscribe = function(message){
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
    $scope.subscribe = subscribe;
}]);
