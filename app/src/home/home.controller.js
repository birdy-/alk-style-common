'use strict';

angular.module('jDashboardFluxApp').controller('HomeCtrl', [
    '$scope', 'permission', '$location', '$modal', '$http', '$window',
    function ($scope, permission, $location, $modal, $http, $window) {
        $scope.brands = [];
        $scope.user = null;
        $scope.isHomePage = true;

        permission.getUser().then(function(user) {
            $scope.user = user;
            $scope.brands = user.brandsOwned;
        });
        $scope.submit = function() {
            $location.path('/flux/maker/' + $scope.brands[0].id + '/product');
        };

        $scope.logout = function() {
            permission.logout();            
            $location.path('/');           
        };

        var subscribe = function(){
            var modalInstance = $modal.open({
                templateUrl: '/src/home/mailinglist.html',
                controller: RegistrationContactModalController,
                resolve: {
                    $http: function () {
                        return $http;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };
        $scope.subscribe = subscribe;                
    }
]);
