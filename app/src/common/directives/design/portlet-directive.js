"use strict";

angular.module('jDashboardFluxApp').directive('portlet', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {},
        templateUrl: 'src/common/directives/design/portlet-directive.html',
        link: function(scope, element, attrs) {
            scope.show = true;
            scope.title = attrs.title;
            scope.color = attrs.color;
        }
    };
});