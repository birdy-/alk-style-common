'use strict';

angular
    .module('jDashboardFluxApp')
        .directive('authdemoapplication', ['$route', function ($route) {
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
                        navbar.hide();
                        login.slideDown('slow', function() {
                            main.hide();
                        });
                    });
                    scope.$on('event:auth-loginConfirmed', function() {
                        main.show();
                        navbar.show();
                        login.slideUp();
                    });
                }
            }
        }]);
