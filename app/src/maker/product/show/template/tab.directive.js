angular.module('jDashboardFluxApp').directive('navProduct', function($location) {
    return {
        restrict: 'AEC',
        transclude: true,
        scope: {
            product: '&'
        },
        replace: true,
        templateUrl: '/src/maker/product/show/template/tab.html',
        link: function(scope, element, attrs) {
            scope.legend = attrs.legend;
            scope.link = attrs.link;
            scope.active = function() {
                if ($location.path().indexOf(scope.link) !== -1) {
                    return {'active': true};
                }
                return {};
            };
        }
    };
});