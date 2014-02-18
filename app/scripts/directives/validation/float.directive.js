'use strict';

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
angular.module('jDashboardFluxApp').directive('alkFloat', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var validator = function(viewValue) {
                if (typeof viewValue !== 'string') {
                    ctrl.$setValidity('float', true);
                    return viewValue;
                }
                if (FLOAT_REGEXP.test(viewValue)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(viewValue.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            };
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.unshift(validator);
        }
    };
});