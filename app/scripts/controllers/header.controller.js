'use strict';

angular.module('jDashboardFluxApp').controller('HeaderCtrl', [
    '$scope', 'permission', '$$sdkCrud', '$location',
    function ($scope, permission, $$sdkCrud, $location) {

    $scope.logged = false;
    $scope.user = {};
    $scope.brand = {};

    var get = function() {
        permission.getUser().then(function(user) {
            $scope.logged = true;
            $scope.user = user;
            $scope.brand = user.ownsBrand[0];
            $scope.brand.picture = {
                logo: 'http://assets.chefjerome.com/api/1/brand/'+$scope.brand.id+'/picture/logo/original.png',
            };
        });
    };
    $scope.logout = function() {
        $$sdkCrud.UserLogout();
        $location.path('/');
        $scope.logged = false;
        $scope.user = {};
        $scope.brand = {};
    };
    get();
    //$scope.$on('event:auth-loginConfirmed', get);
}]);
