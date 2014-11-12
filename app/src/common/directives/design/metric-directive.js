"use strict";

angular.module('jDashboardFluxApp').directive('metric', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {},
        templateUrl: 'src/common/directives/design/metric-directive.html',
        link: function(scope, element, attrs) {
            scope.title = attrs.title;
            scope.color = attrs.color;
        }
    };
});