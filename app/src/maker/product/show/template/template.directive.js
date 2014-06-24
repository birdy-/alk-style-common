angular.module('jDashboardFluxApp').directive('templateProduct', function($compile) {
    return {
        restrict: 'AEC',
        transclude: true,
        templateUrl: '/src/maker/product/show/template/template.html',
        link: function(scope, element, attrs, ctrl) {
        }
    };
});