'use strict';


/**
 * Service that wraps authentication-related processes. Contains the tooling required
 * to handle login, logout and user retrieval.
 *
 * Broadcasts auth-loginConfirmed and auth-loginRequired events to communicate with
 * the rest of the application.
 */
angular.module('jDashboardFluxApp').service('permission', [
    "URL_SERVICE_AUTH", "$http", "$rootScope", "authService", "$window", "$log", "$$BrandRepository",
    function init(URL_SERVICE_AUTH, $http, $rootScope, authService, $window, $log, $$BrandRepository) {

    var userPromise = null;
    var user = null;

    /**
     * Returns a promise that is an image of the user.
     * @return user The global user.
     */
    var getUser = function() {
        if (userPromise == null) {
            var url = URL_SERVICE_AUTH + '/auth/v1/user/me';
            userPromise = $http.get(url).then(function(response, status, headers, config) {
                // Lazy-load relateed entities
                var managesBrand = [];
                response.data.data.managesBrand.forEach(function(brand){
                    var obj = $$BrandRepository.lazy(brand.id);
                    obj.allowed = true;
                    managesBrand.push(obj);
                });
                response.data.data.managesBrand = managesBrand;

                // Create user object
                user = new User();
                user.fromJson(response.data.data);

                // Broadcast event
                $rootScope.$broadcast('event:auth-loginConfirmed');
                return user;
            });
        }
        return userPromise;
    };


    /**
     * Requests Authentication Token from authentication server
     * Post user-provided credentials
     */
    var login = function(login, password) {
        return $http.post(URL_SERVICE_AUTH + '/auth/v1/token', {
            username: login,
            password: password,
            grant_type: 'password'
        }).success(function (response) {
            authService.loginConfirmed();
            $window.sessionStorage.token = response.access_token;
        }).error(function (response, status, headers, config) {
            delete $window.sessionStorage.token;
        });
    };

    /**
     * Logs out the user from authenticated session
     *
     */
    var logout = function() {
        $log.debug('User clicked Logout');
        user = null;
        userPromise = null;
        delete $window.sessionStorage.token;
        $log.debug('Logged out, authentication token erased');

        // do not want to display login form when user
        // manually logs out.
        //$rootScope.$broadcast('event:auth-loginRequired');
    };

    var getAccessToken = function () {
        return $window.sessionStorage.token;
    };

    return {
        user: user,
        getUser: getUser,
        login: login,
        logout: logout,
        getAccessToken: getAccessToken
    };
}]);
