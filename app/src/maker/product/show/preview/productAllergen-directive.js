"use strict";

angular.module('jDashboardFluxApp').directive('alkProductAllergen', function () {
    return {
        restrict: 'AEC',
        replace: true,
        scope: {
            product: '='
        },
        templateUrl: '/src/maker/product/show/preview/productAllergen-directive.html',
        link: function (scope, element, attrs) {
            scope.legend = attrs.legend;
            scope.field = attrs.field;
        }
    };
});