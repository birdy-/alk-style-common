'use strict';

angular.module('jDashboardFluxApp').controller('HomeCtrl', [
    '$scope', 'permission', '$location',
    function ($scope, permission, $location) {
        $scope.brands = [];
        permission.getUser().then(function(user) {
            $scope.brands = user.brandsOwned;
        });
        $scope.submit = function() {
            $location.path('/flux/maker/' + $scope.brands[0].id + '/product');
        };
    }
]);
