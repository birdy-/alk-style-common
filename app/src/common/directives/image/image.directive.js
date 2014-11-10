'use strict';

angular.module('jDashboardFluxApp').directive('entityImage', [
    'URL_CDN_MEDIA',
    function (URL_CDN_MEDIA) {
        return {
            restrict: 'AEC',
            scope: {
                entity: '='
            },
            replace: true,
            templateUrl: '/src/common/directives/image/template.html',
            link: function (scope, elem, attrs) {
                scope['class'] = attrs['class'];

                var setUrl = function (type, id, extra) {
                    var cachebuster = 'cachebuster=' + (Math.random() * 10000000000000000);
                    if (type === 'Shop') {
                        scope.url = URL_CDN_MEDIA + '/shop/' + id + '/picture/logo/original.png' + '?' + cachebuster;
                    } else if (type === 'Brand') {
                        scope.url = URL_CDN_MEDIA + '/brand/' + id + '/picture/logo/original.png' + '?' + cachebuster;
                    } else if (type === 'Product') {
                        scope.url = URL_CDN_MEDIA + '/product/' + id + '/picture/packshot/256x256.png' + '?' + cachebuster;
                    } else if (type === 'Recipe'
                            && extra.url
                            && extra.url.picture
                            && extra.url.picture.length) {
                        scope.url = extra.url.picture[0];
                    }
                };

                if (attrs['entityId'] && attrs['entityType']) {
                    setUrl(attrs['entityType'], attrs['entityId'], {});
                }

                scope.$watch('entity._type', function () {
                    if (!scope.entity) {
                        return;
                    }
                    setUrl(scope.entity._type, scope.entity.id, scope.entity);
                });
            }
        };
    }
]);


angular.module('jDashboardFluxApp').directive('fallbackSrc', function () {
    return {
        link: function postLink (scope, iElement, iAttrs) {
            iElement.bind('error', function () {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
   };
});

