'use strict';

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