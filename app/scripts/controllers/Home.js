'use strict';

angular
    .module('jDashboardFluxApp')
        .controller('HomeCtrl', [
            '$scope',
            '$rootScope',
            '$http',
            'permission',
            'actionRepository',
            '$location',
            'API_URL',
            function ($scope, $rootScope, $http, permission, actionRepository, $location, API_URL) {

            $scope.goto = function(path) {
                $location.path(path);
            };

            $scope.brands = [];
            permission.getUser().then(function(user) {
                $scope.brands = user.brandsOwned;
            });


        }]);


angular
    .module('jDashboardFluxApp')
        .controller('HeaderCtrl', [
            '$scope',
            '$location',
            'headerRepository',
            'permission',
            function ($scope, $location, headerRepository, permission) {

            $scope.headers = headerRepository.findAll();
            $scope.allowed = function(header) {
                return header.allowed();
            };

            $scope.isActive = function (viewLocation) {
                return ($location.path().indexOf(viewLocation) !== -1);
            };
        }]);
