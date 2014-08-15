'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('requiresauth', [
    '$route', '$log',
    function ($route, $log) {
    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            // once Angular is started, remove class:
            elem.removeClass('waiting-for-angular');
            var login = elem.find('#login-holder');

            scope.$on('event:auth-loginRequired', function() {
                // Enable access to public routes.
                if ($route.current.isPublic) {
                    return;
                }
                $log.log('Authentication Directive : please authenticate.');
                login.show();
            });
            scope.$on('event:auth-loginConfirmed', function() {
                $log.log('Authentication Directive : <User> authenticated.');
                login.hide();
            });
        }
    }
}]);
