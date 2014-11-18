'use strict';

angular.module('jDashboardFluxApp').directive('alkModelProductCertifiedSelect', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        require: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function (scope, elem, attrs) {
            scope.placeholder = attrs.placeholder;
            scope.choices = [
                Product.CERTIFICATION_STATUS_DEFAULT,
                Product.CERTIFICATION_STATUS_REVIEWING,
                Product.CERTIFICATION_STATUS_ATTRIBUTED,
                Product.CERTIFICATION_STATUS_ACCEPTED,
                Product.CERTIFICATION_STATUS_CERTIFIED,
                Product.CERTIFICATION_STATUS_PUBLISHED,
                Product.CERTIFICATION_STATUS_DISCONTINUED
            ];
        }
    };
}]);
