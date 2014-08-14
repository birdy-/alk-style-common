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
        if (userPromise == null) {
            var url = URL_SERVICE_AUTH + '/auth/v1/user/me';
            userPromise = $http.get(url).then(function(response, status, headers, config) {
                // Lazy-load relateed entities
                var json = response.data.data;
                json.managesBrand = json.managesBrand.map(function(entity){
                    var obj = $$ORM.repository('Brand').lazy(entity.id).fromJson(entity);
                    obj.allowed = true;
                    return obj;
                });
                json.managesWebsite = json.managesWebsite.map(function(entity){
                    var obj = $$ORM.repository('Website').lazy(entity.id).fromJson(entity);
                    obj.allowed = true;
                    return obj;
                });
                json.managesShop = json.managesShop.map(function(entity){
                    var obj = $$ORM.repository('Shop').lazy(entity.id).fromJson(entity);
                    obj.allowed = true;
                    return obj;
                });
                json.belongsTo = json.belongsTo.map(function(entity){
                    var obj = $$ORM.repository('Organization').lazy(entity.id).fromJson(entity);
                    obj.allowed = true;
                    return obj;
                });

                // Create user object
                user = new User();
                user.fromJson(response.data.data);
                console.log('Done loading in auth directive.');

                // Broadcast event
                $rootScope.$broadcast('event:auth-loginConfirmed');
                return user;
            });
        }
        return userPromise;
    };

    var reset = function() {
        userPromise = null;
        user = null;
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
        reset: reset,
        getUser: getUser,
        login: login,
        logout: logout,
        getAccessToken: getAccessToken
    };
}]);
