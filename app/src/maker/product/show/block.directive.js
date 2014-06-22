"use strict";

angular.module('jDashboardFluxApp').directive('inputBlockHelp', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            field: '='
        },
        templateUrl: '/src/maker/product/show/block-help.html',
        link: function(scope, element, attrs) {
        }
    };
});
angular.module('jDashboardFluxApp').directive('inputBlockExample', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            field: '='
        },
        templateUrl: '/src/maker/product/show/block-example.html',
        link: function(scope, element, attrs) {
        }
    };
});
angular.module('jDashboardFluxApp').directive('inputBlockGdsn', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            field: '='
        },
        templateUrl: '/src/maker/product/show/block-gdsn.html',
        link: function(scope, element, attrs) {
        }
    };
});
