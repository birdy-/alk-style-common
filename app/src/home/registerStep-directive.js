'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkRegisterStep',
    function () {
        return {
            scope: {
                status: '=alkRegisterStep'
            },
            transclude: true,
            replace: true,
            restrict: 'AEC',
            templateUrl: '/src/home/registerStep-directive.html',
            link: function(scope, elem, attrs) {
            }
        };
    }
);
