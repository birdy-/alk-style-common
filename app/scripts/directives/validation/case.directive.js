'use strict';

angular.module('jDashboardFluxApp').directive('alkValidationCase', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var validator = function(viewValue) {
                if (/^[a-z]/.test(viewValue) || /^[0-9]/.test(viewValue)) {
                    ctrl.$setValidity('caseStart', false);
                } else {
                    ctrl.$setValidity('caseStart', true);
                }
                if (viewValue.match(/[A-Z]/g).length > 4) {
                    ctrl.$setValidity('caseTooManyUpper', false);
                } else {
                    ctrl.$setValidity('caseTooManyUpper', true);
                }
                return viewValue;
            };
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.unshift(validator);
        }
    };
});
