'use strict';


/**
 * Service that wraps authentication-related processes. Contains the tooling required
 * to handle login, logout and user retrieval.
 *
 * Broadcasts auth-loginConfirmed and auth-loginRequired events to communicate with
 * the rest of the application.
 */
angular.module('jDashboardFluxApp').service('permission', [
    "URL_SERVICE_AUTH", "$http", "$rootScope", "authService", "$window", "$log", "$brandRepository",
    function init(URL_SERVICE_AUTH, $http, $rootScope, authService, $window, $log, $brandRepository) {

    /**
     * Returns whether the access to an entity of a given type and id is
     * allowed.
     *
     * @param string type The type of entity.
     * @param integer id The id of the entity.
     * @return Boolean Whether the access is allowed or not.
     */
    var isAllowed = function(type, id) {
        var considers = [];
        if (type == 'Shop') {
            considers = user.managesShop;
        } else if (type == 'Brand') {
            considers = user.managesBrand;
        } else if (type == 'Website') {
            considers = user.managesWebsite;
        } else {
            throw 'Unknown type : '+type;
        }
        for (var i = 0; i < considers.length; i++) {
            if (considers[i].id == id) {
                return true;
            }
        }
        return false;
    };

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
                user = response.data.data;
                // Attach methods
                user.isAllowed = isAllowed;
                $rootScope.$broadcast('event:auth-loginConfirmed');


                var managesBrand = [];
                user.managesBrand.forEach(function(brand){
                    managesBrand.push($brandRepository.lazy(brand.id));
                });
                user.managesBrand = managesBrand;
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
        isAllowed: isAllowed,
        getAccessToken: getAccessToken
    };
}]);
