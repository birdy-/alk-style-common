'use strict';

angular.module('jDashboardFluxApp')

.controller('DemoVideoModalController', [
    '$modalInstance',
    function ($modalInstance) {
        $scope.closeDemoVideo = function () {
            $modalInstance.dismiss('cancel');
        };
}]);
