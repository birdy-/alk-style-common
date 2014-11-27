'use strict';

angular.module('jDashboardFluxApp').directive('inputMatch', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            inputMatch: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.inputMatch === modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('inputMatch', currentValue);
            });
        }
    };
});
