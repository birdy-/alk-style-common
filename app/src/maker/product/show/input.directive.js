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
angular.module('jDashboardFluxApp').directive('productLabel', function($compile) {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            product: '=',
            legend: '=',
        },
        templateUrl: '/src/maker/product/show/input-label.html',
        link: function(scope, element, attrs, ctrl) {
            scope.name = attrs.name;

            var getProductHasLabelFromId = function(product, id) {
                for (var i = 0; i < product.isLabeledBy.length; i++) {
                    // if (product.isLabeledBy[i].isConceptualizedBy.id == id) {
                    if (product.isLabeledBy[i].id == id) {
                        return i;
                    }
                }
                return -1;
            };

            scope.$watch('product', function(){
                if (typeof(scope.product.isLabeledBy) === 'undefined') {
                    return;
                }
                var index = getProductHasLabelFromId(scope.product, scope.legend.id);
                if (index > -1) {
                    scope.label = true;
                } else {
                    scope.label = false;
                }
            }, true);

            var change = function(){
                // console.log(scope.label);
                // console.log(scope.product.isLabeledBy);
                if (scope.label) {
                    var index = getProductHasLabelFromId(scope.product, scope.legend.id);
                    if (index === -1) {
                        var phl = new ProductHasLabel();
                        // phl.isConceptualizedBy = scope.legend;
                        phl.id = scope.legend.id;
                        scope.product.isLabeledBy.push(phl);
                    }
                } else {
                    var index = getProductHasLabelFromId(scope.product, scope.legend.id);
                    if (index > -1) {
                        scope.product.isLabeledBy.splice(index, 1);
                    }
                }
                // console.log(scope.product.isLabeledBy);
            };
            scope.change = change;
        }
    };
});
angular.module('jDashboardFluxApp').directive('productNutrition', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            pnq: '=',
            psqs: '='
        },
        templateUrl: '/src/maker/product/show/input-nutrition.html',
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
