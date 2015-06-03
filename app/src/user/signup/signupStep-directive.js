'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkSignupStep',
    function () {
        return {
            scope: {
                status: '=alkSignupStep'
            },
            transclude: true,
            replace: true,
            restrict: 'AEC',
            templateUrl: '/src/user/signup/signupStep-directive.html',
            link: function(scope, elem, attrs) {
            }
        };
    }
);
