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
            legend: '=',
            psqs: '='
        },
        templateUrl: '/src/maker/product/show/input-nutrition.html',
        link: function(scope, element, attrs) {
        }
    };
});
angular.module('jDashboardFluxApp').directive('productNutritionCell', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            legend: '=',
            psq: '=',
            pnq: '=',
        },
        templateUrl: '/src/maker/product/show/input-nutrition-cell.html',
        link: function(scope, element, attrs) {
            scope.precisions = [
                ProductNutritionalQuantity.MEASUREMENTPRECISION_EXACT,
                ProductNutritionalQuantity.MEASUREMENTPRECISION_APPROXIMATELY,
                ProductNutritionalQuantity.MEASUREMENTPRECISION_LESS_THAN
            ];
            scope.show = function() {
                if (!scope.pnq) {
                    return false;
                }
                if (scope.pnq.quantity > 0
                || scope.pnq.percentageOfDailyValueIntake > 0) {
                    return true;
                }
                return false;
            };
        }
    };
});
