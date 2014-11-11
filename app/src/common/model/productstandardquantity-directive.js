'use strict';

angular.module('jDashboardFluxApp').directive('alkModelProductstandardquantityPreparationstateSelect', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function (scope, elem, attrs) {
            scope.choices = [
                ProductStandardQuantity.PREPARATIONSTATE_UNPREPARED,
                ProductStandardQuantity.PREPARATIONSTATE_PREPARED
            ];
        }
    };
}]);
