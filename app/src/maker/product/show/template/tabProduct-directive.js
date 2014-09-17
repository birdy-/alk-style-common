'use strict';

angular.module('jDashboardFluxApp').directive('tabProduct', [
    '$location',
    function($location) {
        return {
            restrict: 'AEC',
            scope: {
                product: '&',
                locked: '='
            },
            replace: true,
            templateUrl: '/src/maker/product/show/template/tabProduct.html',
            link: function(scope, element, attrs) {
                scope.legend = attrs.legend;
                scope.color = attrs.color;
                scope.link = attrs.link;
                var active = function() {
                    return $location.path().indexOf(scope.link) !== -1;
                };
                scope.classes = function() {
                    var classes = {};
                    if (active()) {
                        classes.active = true;
                    }
                    if (scope.locked) {
                        classes.disabled = true;
                    }
                    return classes;
                };
                scope.go = function() {
                    $location.path('/maker/product/' + scope.product() + '/data/' + scope.link);
                };
            }
        };
}]);