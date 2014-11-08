'use strict';

angular.module('jDashboardFluxApp').directive('alkValidationName', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var validator = function(viewValue) {
                if (angular.isEmpty(viewValue) || angular.isEmpty(attrs.alkValidationName)) {
                    ctrl.$setValidity('containsBrand', true);
                    return viewValue;
                }
                if (viewValue.toLowerCase().indexOf(attrs.alkValidationName.toLowerCase()) !== -1) {
                    ctrl.$setValidity('containsBrand', false);
                } else {
                    ctrl.$setValidity('containsBrand', true);
                }
                return viewValue;
            };
            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.unshift(validator);
        }
    };
});
