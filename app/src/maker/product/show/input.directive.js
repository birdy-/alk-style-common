"use strict";

angular.module('jDashboardFluxApp').directive('ternary', function($compile) {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            field: '='
        },
        templateUrl: '/src/maker/product/show/input-ternary.html',
        link: function(scope, element, attrs, ctrl) {
            scope.name = attrs.name;
            scope.label = attrs.label;
        }
    };
});
angular.module('jDashboardFluxApp').directive('boolean', function($compile) {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            field: '='
        },
        templateUrl: '/src/maker/product/show/input-boolean.html',
        link: function(scope, element, attrs, ctrl) {
            scope.name = attrs.name;
            scope.label = attrs.label;
        }
    };
});
