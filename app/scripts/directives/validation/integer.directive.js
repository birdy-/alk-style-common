'use strict';

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
            ctrl.$parsers.unshift(validator):
            ctrl.$formatters.unshift(validator):
        }
    };
});
