'use strict';

angular.module('jDashboardFluxApp').directive('selectCommonunit', [
    '$$ORM',
    function ($$ORM) {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-object.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                $$ORM.repository('CommonUnit').lazy(3),
                $$ORM.repository('CommonUnit').lazy(22),
                $$ORM.repository('CommonUnit').lazy(7),
                $$ORM.repository('CommonUnit').lazy(9),
                $$ORM.repository('CommonUnit').lazy(2)
            ];
        }
    };
}]);
