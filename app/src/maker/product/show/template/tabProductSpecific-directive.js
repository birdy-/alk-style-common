'use strict';

/**
 * Directive that creates a tab wich legend and link adapts to the type
 * of Product that is being edited by the user.
 */
angular.module('jDashboardFluxApp').directive('tabProductSpecific', [
    '$location',
    function($location) {
        return {
            restrict: 'AEC',
            scope: {
                product: '=',
            },
            replace: true,
            templateUrl: '/src/maker/product/show/template/tabProductSpecific.html',
            link: function(scope, element, attrs) {

                scope.visible = false;

                // Views need to be registered in app.js
                // Templates must be stored in the product/show/specific directory
                var mappings = {
                    wine: { href: 'specific/wine', legend: 'Vin' }
                };
                scope.$watch('product.hasSpecificData', function(which){
                    if (!which) {
                        scope.href = null;
                        scope.visible = false;
                        return;
                    }
                    var mapping = mappings[which];
                    if (!mapping) {
                        scope.href = null;
                        scope.visible = false;
                        return;
                    }
                    scope.visible = true;
                    scope.href = mapping.href;
                    scope.legend = mapping.legend;
                }, true);

                /**
                 * Whether the current view is this tab.
                 */
                var active = function() {
                    return $location.path().indexOf(scope.href) !== -1;
                };
                /**
                 * Changes the appearance of the current tab if it is being viewed.
                 */
                scope.classes = function() {
                    if (active()) {
                        return 'active';
                    }
                    return '';
                };
                /**
                 * Loads the appropriate view.
                 */
                scope.go = function() {
                    $location.path('/maker/product/' + scope.product.id + '/data/' + scope.href);
                };
            }
        };
}]);