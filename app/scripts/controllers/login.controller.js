'use strict';



angular.module('jDashboardFluxApp')
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
            '$window',
             function ($scope, $http, authService, API_URL, $window) {

            $scope.login = null;
            $scope.password = null;
            $scope.rememberme = null;
            $scope.message = null;

            $scope.authentified = false;

            $scope.username = null;
            
            $scope.submit = function() {
                $http
                    .post('https://auth.alkemics.com/auth/v1/token', 
                    // .post('http://127.0.0.1:6545/auth/v1/token', 
                        {
                            username: $scope.login, 
                            password:$scope.password,
                            grant_type: 'password'
                        })
                    .success(function (data) {
                        
                        $scope.authentified = true;
                        authService.loginConfirmed();

                        $window.sessionStorage.token = data.access_token;
                        $scope.message = 'Welcome';
                    })
                    .error(function (data, status, headers, config) {
                        // Erase the token if the user fails to log in
                        delete $window.sessionStorage.token;
                        // Handle login errors here
                        $scope.message = 'Error: Invalid user or password';
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
