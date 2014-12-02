'use strict';

angular.module('jDashboardFluxApp')

.directive('demoVideo', [
    '$modal',
    function ($modal) {
        return {
            restrict: 'AC',
            controller: ['$scope',
            function ($scope) {
                $scope.openDemoVideo = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/src/common/directives/demo-video/demo-video-modal.html',
                        controller: 'DemoVideoModalController'
                    });
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                };
            }]
        };
}]);
