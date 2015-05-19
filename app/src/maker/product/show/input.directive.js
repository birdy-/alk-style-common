"use strict";

angular.module('jDashboardFluxApp').directive('ternary', function($compile) {
    return {
        restrict: 'AEC',
        transclude: true,
        require: '^ngModel',
        scope: {
            suggestModel: '=alkSuggest',
            localModel: '=ngModel'
        },
        templateUrl: '/src/maker/product/show/input-ternary.html',
        link: function(scope, element, attrs, ctrl) {
            scope.field = attrs.name;
            scope.label = attrs.label;
            scope.suggestValue = function(value) {
                if (!scope.suggestModel
                || typeof(scope.suggestModel[scope.field]) === 'undefined'
                || scope.suggestModel[scope.field] === null
                || scope.suggestModel[scope.field] !== value
                || scope.localModel[scope.field] === value) {
                    return {};
                }
                return {'input-suggest': true };
            };
            scope.suggestSomething = function() {
                if (!scope.suggestModel
                || typeof(scope.suggestModel[scope.field]) === 'undefined') {
                    return false;
                }
                if (scope.suggestModel[scope.field] === null) {
                    return false;
                }
                return scope.suggestModel[scope.field] !== scope.localModel[scope.field];
            };
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
        restrict: 'A',
        transclude: true,
        scope: {
            product: '=',
            legend: '='
        },
        templateUrl: '/src/maker/product/show/input-label.html',
        link: function(scope, element, attrs, ctrl) {
            scope.name = attrs.name;

            var getProductHasLabelFromId = function(product, id) {
                for (var i = 0; i < product.isLabeledBy.length; i++) {
                    if (product.isLabeledBy[i].concept.id === id) {
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
                var index = getProductHasLabelFromId(scope.product, scope.legend.id);
                if (scope.label) {
                    if (index === -1) {
                        var phl = new ProductHasLabel();
                        phl.concept = scope.legend;
                        scope.product.isLabeledBy.push(phl);
                    }
                } else {
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
angular.module('jDashboardFluxApp').directive('productNutritionCell', ['$$ajr', function ($$ajr) {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            legend: '=',
            psq: '=',
            pnq: '='
        },
        templateUrl: '/src/maker/product/show/input-nutrition-cell.html',
        link: function(scope, element, attrs) {
            scope.precisions = [
                ProductNutritionalQuantity.MEASUREMENTPRECISION_EXACT,
                ProductNutritionalQuantity.MEASUREMENTPRECISION_APPROXIMATELY,
                ProductNutritionalQuantity.MEASUREMENTPRECISION_LESS_THAN
            ];

            scope.updateDailyValueFromQuantity = function(){
                var conceptId = scope.pnq.isConceptualizedBy.id;
                if (conceptId){
                    var ajr = $$ajr[conceptId];
                    if(ajr && scope.pnq.quantity != null){
                        var percent = (scope.pnq.quantity / getConversionRate() * 100) / ajr;
                        scope.pnq.percentageOfDailyValueIntake =  Math.round(100*percent)/100;
                    }
                }
            };

            scope.updateQuantityFromDailyValue = function(){
                var conceptId = scope.pnq.isConceptualizedBy.id;
                if (conceptId){
                    var ajr = $$ajr[conceptId];
                    if(ajr && scope.pnq.percentageOfDailyValueIntake != null){
                      var quantity = scope.pnq.percentageOfDailyValueIntake * ajr / 100;
                      var rounded = getConversionRate()*Math.round(100*quantity)/100;
                      // Due to units problems, rounding can be wrong
                      if(rounded==0){
                          rounded = getConversionRate()*Math.round(1000*100*quantity)/(100*1000);
                      }
                      if(rounded==0){
                        rounded = getConversionRate()*Math.round(1000*1000*100*quantity)/(100*1000*1000);
                      }
                      scope.pnq.quantity = rounded;
                    }
                }
            };

            var getConversionRate = function(){
                var conversion = 1;
                if(scope.pnq.isMeasuredBy.id == 101){//mg
                  conversion = 1000;
                }
                else if(scope.pnq.isMeasuredBy.id == 102){//micro g
                  conversion = 1000000;
                }
                return conversion;
            }

            scope.$watch('pnq.isMeasuredBy', function(oldValue, newValue){
                scope.updateDailyValueFromQuantity();
            });

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
}]);
angular.module('jDashboardFluxApp').directive('inputRich', function() {
    return {
        restrict: 'AEC',
        transclude: true,
        templateUrl: '/src/maker/product/show/input-rich.html',
        scope: {
            form: '=inputRichForm',
            field: '=inputRichField'
        },
        link: function(scope, element, attrs) {
        }
    };
});
