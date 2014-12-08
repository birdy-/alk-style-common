'use strict';

angular.module('jDashboardFluxApp')

.controller('DemoVideoModalController', [
    '$modalInstance', '$scope',
    function ($modalInstance, $scope) {
        $scope.closeDemoVideo = function () {
            $modalInstance.dismiss('cancel');
        };
}]);
