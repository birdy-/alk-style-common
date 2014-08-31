'use strict';

angular.module('jDashboardFluxApp').directive('entityImage', ['URL_CDN_MEDIA',
    function (URL_CDN_MEDIA) {
    return {
        restrict: 'AEC',
        scope: {
            entity: '='
        },
        replace: true,
        templateUrl: '/src/common/directives/image/template.html',
        link: function(scope, elem, attrs) {

            scope['class'] = attrs['class'];
            scope.$watch('entity._type', function(){
                var cachebuster = Math.random() * 10000000000000000;
                if (!scope.entity) {
                    return;
                }
                if (scope.entity._type === 'Shop') {
                    scope.url = 'https://smedia.alkemics.com/shop/' + scope.entity.id + '/picture/logo/original.png' + '?' + cachebuster;
                } else if (scope.entity._type === 'Brand') {
                    scope.url = 'https://smedia.alkemics.com/brand/' + scope.entity.id + '/picture/logo/original.png' + '?' + cachebuster;
                } else if (scope.entity._type === 'Product') {
                    scope.url = URL_CDN_MEDIA + '/product/' + scope.entity.id + '/picture/packshot/256x256.png' + '?' + cachebuster;
                } else if (scope.entity._type === 'Recipe'
                        && scope.entity.url
                        && scope.entity.url.picture
                        && scope.entity.url.picture.length) {
                    scope.url = scope.entity.url.picture[0];
                }
            });
        }
    };
}]);
