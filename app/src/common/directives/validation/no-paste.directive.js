'use strict';

angular.module('jDashboardFluxApp').directive('noPaste', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element[0].onpaste = function (e) {
                e.preventDefault();
            };
        }
    };
});
