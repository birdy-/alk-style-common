'use strict';

angular.module('jDashboardFluxApp').directive('alkModelNutrimentunitSelect', [
    '$$ORM',
    function ($$ORM) {
    return {
        restrict: 'AC',
        scope: {
            localModel: '=ngModel'
        },
        require: 'ngModel',
        templateUrl: '/src/common/directives/input/select-object.html',
        link: function (scope, elem, attrs) {
            scope.choices = [
                $$ORM.repository('CommonUnit').lazy(3),
                $$ORM.repository('CommonUnit').lazy(101),
                $$ORM.repository('CommonUnit').lazy(102)
            ];
        }
    };
}]);
