'use strict';

angular.module('jDashboardFluxApp')

.controller('DemoVideoController', ['$scope', '$modal',
    function ($scope, $modal) {
    $scope.openDemoVideo = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/common/directives/demo-video/demo-video-modal.html',
            controller: 'DemoVideoModalController'
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };
}])

.directive('demoVideo', [
    function () {
        return {
            restrict: 'AC',
            controller: 'DemoVideoController'
        };
}]);
