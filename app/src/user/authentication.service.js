'use strict';


/**
 * Service that wraps authentication-related processes. Contains the tooling required
 * to handle login, logout and user retrieval.
 *
 * Broadcasts auth-loginConfirmed and auth-loginRequired events to communicate with
 * the rest of the application.
 */
angular.module('jDashboardFluxApp').service('permission', [
    "URL_SERVICE_AUTH", "$http", "$rootScope", "authService", "$window", "$log", "$$ORM",
    function init(URL_SERVICE_AUTH, $http, $rootScope, authService, $window, $log, $$ORM) {

    var userPromise = null;
    var user = null;

    /**
     * Returns a promise that is an image of the user.
     * @return user The global user.
     */
    var getUser = function() {
        if (userPromise === null) {
            var url = URL_SERVICE_AUTH + '/auth/v1/user/me';
            userPromise = $http.get(url).then(function(response) {
                // Load entity
                user = $$ORM.repository('User').hydrate(response.data.data);

                // Load relations
                user.managesBrand.forEach(function(relation){ relation.allowed = true; });
                user.managesWebsite.forEach(function(relation){ relation.allowed = true; });
                user.managesShop.forEach(function(relation){ relation.allowed = true; });
                user.belongsTo.forEach(function(relation){ relation.allowed = true; });

                // Broadcast event
                $log.log('Authentication Service : <User ' + user.id + '> loaded.');
                $rootScope.$broadcast('event:auth-loginConfirmed');
                return user;
            });
        }
        return userPromise;
    };

    /**
     * Resets the service to clear the user.
     */
    var reset = function() {
        userPromise = null;
        user = null;
    };


    /**
     * Requests Authentication Token from authentication server
     * Post user-provided credentials
     */
    var login = function(login, password) {
        return $http.post(URL_SERVICE_AUTH + '/auth/v1/user/login', {
            username: login,
            password: password,
            grant_type: 'password',
            origin: 'dashboard_stream'
        }).success(function (response) {
            authService.loginConfirmed();
            $window.sessionStorage.token = response.access_token;
        }).error(function () {
            delete $window.sessionStorage.token;
        });
    };

    /**
     * Logs out the user from authenticated session
     *
     */
    var logout = function() {
        $log.debug('User clicked Logout');
        reset();
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
        reset: reset,
        getUser: getUser,
        login: login,
        logout: logout,
        getAccessToken: getAccessToken
    };
}]);
