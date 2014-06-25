'use strict';

angular.module('jDashboardFluxApp').controller('HomeCtrl', [
    '$scope', 'permission', '$location', '$modal', '$http',
    function ($scope, permission, $location, $modal, $http) {
        $scope.brands = [];
        $scope.user = {};
        permission.getUser().then(function(user) {
            $scope.user = user;
            $scope.brands = user.brandsOwned;
        });
        $scope.submit = function() {
            $location.path('/flux/maker/' + $scope.brands[0].id + '/product');
        };

        var subscribe = function(){
            var modalInstance = $modal.open({
                templateUrl: '/src/home/mailinglist.html',
                controller: MailingListModalController,
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
