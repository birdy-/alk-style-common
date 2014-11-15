"use strict";

angular.module('jDashboardFluxApp').directive('alkProductNutrition', function () {
    return {
        restrict: 'AEC',
        replace: true,
        scope: {
            legend: '=',
            pnqs: '=',
            psqs: '='
        },
        templateUrl: '/src/maker/product/show/preview/productNutrition-directive.html',
        link: function(scope, element, attrs) {
        }
    };
});