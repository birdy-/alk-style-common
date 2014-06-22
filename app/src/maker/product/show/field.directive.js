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
            var concept_id = scope.pnq.isConceptualizedBy.id;
            scope.legend = scope.pnq;
            scope.pnqs = [];
            scope.$watch('psqs', function(new_, old_) {
                scope.pnqs = [];
                angular.forEach(scope.psqs, function(psq){
                    var pnq = psq.getContainsById(concept_id);
                    scope.pnqs.push(pnq);
                });
            }, true);

            scope.show = function() {
                for (var i = 0; i < scope.pnqs.length; i++) {
                    if (scope.pnqs[i].quantity > 0
                    || scope.pnqs[i].percentageOfDailyValueIntake > 0) {
                        return true;
                    }
                }
                return false;
            };
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




