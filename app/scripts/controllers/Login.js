'use strict';

angular
    .module('jDashboardFluxApp')
        /**
         * Quick and dirty controller to login through JSONP. Not very secure...
         *
         * @todo refactor that with actual authentication.
         */
        .controller('LoginController', [
            '$scope',
            '$http',
            'authService',
            'API_URL',
             function ($scope, $http, authService, API_URL) {

            $scope.login = '';
            $scope.password = '';
            $scope.rememberme = '';
            $scope.message = '';

            $scope.authentified = false;

            $scope.username = null;
            $scope.password = null;
            $scope.submit = function() {

                var url = API_URL
                        + '/api/1/account/login'
                        + '?callback=' + 'JSON_CALLBACK'
                        + '&login=' + $scope.login
                        + '&rememberme=' + $scope.rememberme
                        + '&password=' + $scope.password ;
                $http.jsonp(url).success(function(body, status, headers, config) {
                    $scope.login = body.data.account.login;
                    $scope.message = body.message;
                    $scope.authentified = true;
                    authService.loginConfirmed();
                });
            };

            $scope.isReset = false;
            $scope.toggleReset = function () {
                $scope.isReset = true;
            };

            $scope.reset = function () {
                $scope.message = "Feature not available yet - Please contact admin@chefjerome.com";
            }

        }]);
