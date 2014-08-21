'use strict';

angular.module('jDashboardFluxApp').directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var minValidator = function(value) {
              var min = scope.$eval(attr.ngMin) || 0;
              if (!angular.isEmpty(value) && parseFloat(value) < min) {
                ctrl.$setValidity('min', false);
                return undefined;
              } else {
                ctrl.$setValidity('min', true);
                return value;
              }
            };
            ctrl.$parsers.unshift(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});
