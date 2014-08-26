'use_strict';

angular.module('jDashboardFluxApp').directive('navProduct', [
    '$location',
    function($location) {
        return {
            restrict: 'AEC',
            scope: {
                product: '&',
                locked: '='
            },
            replace: true,
            templateUrl: '/src/maker/product/show/template/navProduct.html',
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
                    if (scope.locked) {
                        return;
                    }
                    $location.path('/maker/product/' + scope.product() + '/' + scope.link);
                };
                scope.style = function() {
                    if (active()) {
                        return {'background-color': 'white', 'color': 'black'};
                    }
                    if (scope.locked) {
                        return {'color': 'white'};
                    }
                    return {};
                };
            }
        };
}]);