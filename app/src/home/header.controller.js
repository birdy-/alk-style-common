'use strict';

angular.module('jDashboardFluxApp').controller('HeaderCtrl', [
    '$scope', 'permission', '$$sdkCrud', '$location', '$window',
    function ($scope, permission, $$sdkCrud, $location, $window) {

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
        $window.sessionStorage.token = null;
        $location.path('/');
        $scope.logged = false;
        $scope.user = {};
        $scope.brand = {};
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
                logo: 'http://assets.chefjerome.com/api/1/brand/' + $scope.brand.id + '/picture/logo/original.png',
            };
        });
    };
    init();
}]);
