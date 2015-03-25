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
                scope.fallbackSrcUrl = '/images/missing.png';

                var setUrl = function (type, id, extra) {
                    var cachebuster = 'cachebuster=' + (Math.random() * 10000000000000000);
                    if (type === 'Shop') {
                        scope.url = URL_CDN_MEDIA + '/shop/' + id + '/picture/logo/original.png' + '?' + cachebuster;
                    } else if (type === 'Brand') {
                        scope.url = URL_CDN_MEDIA + '/brand/' + id + '/picture/logo/original.png' + '?' + cachebuster;
                    } else if (type === 'Product') {
                        scope.url = URL_CDN_MEDIA + '/product/' + id + '/picture/packshot/256x256.png' + '?' + cachebuster;
                    } else if (type === 'ProductInShop' && extra.picture) {
                        scope.url = extra.picture.main + '?' + cachebuster;
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
        link: function postLink (scope, element, attrs) {
            element.bind('error', function () {
                angular.element(this).attr("src", attrs.fallbackSrc);

            });
        }
   };
});

angular.module('jDashboardFluxApp').directive('fallbackImages', function () {
    return {
        restrict: 'AC',
        scope: {
            fallbackImages: '='
        },
        controller: ['$scope', function postController ($scope) {
            $scope.badImages = [];
            $scope.imageFailed = function (image) {
                $scope.badImages.push(image);
            };
            $scope.image = function () {
                var potentialNextImages = $scope.fallbackImages.filter(function (image) {
                    return $scope.badImages.indexOf(image) === -1;
                });
                if(potentialNextImages.length > 0) {
                    return potentialNextImages[0];
                }
            };
        }],
        link: function postLink (scope, element, attrs) {
            var loadElement = angular.element(document.createElement('img'));
            scope.$watch('image()', function (newImage, oldImage) {
                if(newImage) {
                    loadElement.attr('src', newImage);
                }
            });

            loadElement.bind('error', function () {
                scope.$apply(function () { scope.imageFailed(loadElement.attr('src')); });
            });

            loadElement.bind('load', function () {
                element.attr('src', loadElement.attr('src'));
            });
        }
    };
});
