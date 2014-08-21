'use strict';

angular.module('jDashboardFluxApp').directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            var maxValidator = function(value) {
                var max = scope.$eval(attr.ngMax) || Infinity;
                if (!angular.isEmpty(value) && parseFloat(value) > max) {
                    ctrl.$setValidity('max', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('max', true);
                    return value;
                }
            };
            ctrl.$parsers.unshift(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});
