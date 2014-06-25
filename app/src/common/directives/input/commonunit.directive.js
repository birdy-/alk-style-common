'use strict';

angular.module('jDashboardFluxApp').directive('selectCommonunit', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-object.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                { name:'g', id:3 },
                { name:'kg', id:22 },
                { name:'cl', id:7 },
                { name:'l', id:9 },
                { name:'ml', id:2 },
            ];
        }
    }
}]);
