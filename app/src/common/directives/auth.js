'use strict';

angular.module('jDashboardFluxApp').directive('authdemoapplication', [
    '$route', '$location',
    function ($route, $location) {

    return {
        restrict: 'C',
        link: function(scope, elem, attrs) {
            //once Angular is started, remove class:
            elem.removeClass('waiting-for-angular');

            var login = elem.find('#login-holder');
            var main = elem.find('#content-holder');
            var navbar = elem.find('#navbar-holder');
            login.hide();

            scope.$on('event:auth-loginRequired', function() {
                // Enable access to public routes.
                if ($route.current.isPublic) {
                    return;
                }
                login.show();
                main.hide();
                navbar.hide();
            });
            scope.$on('event:auth-loginConfirmed', function() {
                login.hide();
                main.show();
                navbar.show();
                $location.path($location.path());
            });
        }
    };
}]);
