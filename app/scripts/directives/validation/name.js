'use strict';

angular.module('jDashboardFluxApp').directive('alkValidationName', [function() {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function(value) {
                if (typeof value === 'undefined') {
                    return;
                }
                if (value.toLowerCase().indexOf('nestle') !== -1) {
                    c.$setValidity('containsBrand', false);
                } else {
                    c.$setValidity('containsBrand', true);
                }
            });
        }
    }
}]);

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
angular.module('jDashboardFluxApp').directive('alkFloat', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (FLOAT_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            });
        }
    };
});


var INTEGER_REGEXP = /^\d+$/;
angular.module('jDashboardFluxApp').directive('alkInteger', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                if (INTEGER_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('integer', true);
                    return parseInt(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
});


function isEmpty(value) {
  return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

angular.module('jDashboardFluxApp').directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var minValidator = function(value) {
              var min = scope.$eval(attr.ngMin) || 0;
              if (!isEmpty(value) && parseFloat(value) < min) {
                ctrl.$setValidity('min', false);
                return undefined;
              } else {
                ctrl.$setValidity('min', true);
                return value;
              }
            };
            ctrl.$parsers.unshift(minValidator);
            // ctrl.$formatters.push(minValidator);
        }
    };
});

angular.module('jDashboardFluxApp').directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var maxValidator = function(value) {
              var max = scope.$eval(attr.ngMax) || Infinity;
              if (!isEmpty(value) && parseFloat(value) > max) {
                ctrl.$setValidity('max', false);
                return undefined;
              } else {
                ctrl.$setValidity('max', true);
                return value;
              }
            };
            ctrl.$parsers.unshift(maxValidator);
            //ctrl.$formatters.push(maxValidator);
        }
    };
});


angular.module('jDashboardFluxApp').directive('alkFocus', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            elem.bind('blur', function () {
                scope.$apply(function(){
                    ctrl.$focus = false;
                });
            });
            elem.bind('focus', function () {
                scope.$apply(function(){
                    ctrl.$focus = true;
                });
            });
        }
    };
});
