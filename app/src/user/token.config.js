'use strict';

/**
 * $http interceptor.
 * Add token to every request that is issued to the apis.
 */
angular.module('jDashboardFluxApp').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$window', '$cookieStore', function($window, $cookieStore) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                } else if ($cookieStore.get("authtoken")) {
                    $window.sessionStorage.token = $cookieStore.get("authtoken");
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            }
        };
    }]);
}]);