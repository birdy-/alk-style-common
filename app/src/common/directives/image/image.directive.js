'use strict';

angular.module('jDashboardFluxApp').directive('entityImage', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            entity: '=',
        },
        replace: true,
        templateUrl: '/src/common/directives/image/template.html',
        link: function(scope, elem, attrs) {
            scope.class = attrs.class;
            scope.$watch('entity', function(){
                if (scope.entity._type == 'Shop') {
                    scope.url = 'https://smedia.alkemics.com/shop/'+scope.entity.id+'/picture/logo/original.png';
                }
                if (scope.entity._type == 'Brand') {
                    scope.url = 'https://smedia.alkemics.com/brand/'+scope.entity.id+'/picture/logo/original.png';
                }
            }, true);
        }
    }
}]);
