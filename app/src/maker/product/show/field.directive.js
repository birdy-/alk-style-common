"use strict";

angular.module('jDashboardFluxApp').directive('productField', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            pnq: '=',
            psqs: '='
        },
        templateUrl: '/src/maker/product/show/field.html',
        link: function(scope, element, attrs) {
            scope.$watch('pnq.quantity', function(new_, old_) {
                if (new_ > 0) {
                    if (scope.pnq.percentageOfDailyValueIntake === null) {
                        scope.pnq.percentageOfDailyValueIntake = 2 * scope.pnq.quantity;
                    }
                }
            });
        }
    };
});

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




