'use strict';

angular.module('jDashboardFluxApp').directive('userSticker', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            user: '='
        },
        replace: true,
        templateUrl: '/src/user/profile/sticker.html',
        link: function(scope, elem, attrs) {
            scope.role = null;
        }
    };
}]);
