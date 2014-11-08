'use strict';

angular.module('jDashboardFluxApp').directive('selectCommonunit', [
    '$$CommonUnitRepository',
    function ($$CommonUnitRepository) {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-object.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                $$CommonUnitRepository.lazy(3).fromJson({ name:'g', id:3 }),
                $$CommonUnitRepository.lazy(22).fromJson({ name:'kg', id:22 }),
                $$CommonUnitRepository.lazy(7).fromJson({ name:'cl', id:7 }),
                $$CommonUnitRepository.lazy(9).fromJson({ name:'l', id:9 }),
                $$CommonUnitRepository.lazy(2).fromJson({ name:'ml', id:2 })
            ];
        }
    };
}]);
