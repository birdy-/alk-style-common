'use strict';

angular.module('jDashboardFluxApp')
.directive('alkProductsClaim', [
    function () {
        return {
            restrict: 'AC',
            controller: 'ProductClaimController',
            scope: false,
            transclude: false,
            templateUrl: '/src/maker/product/certify/claim.html',
            link: function($scope, $element, $attrs) {
            }
        };
    }
]);
