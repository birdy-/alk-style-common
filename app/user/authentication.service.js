'use strict';


/**
 * Service that wraps authentication-related processes. Contains the tooling required
 * to handle login, logout and user retrieval.
 *
 * Broadcasts auth-loginConfirmed and auth-loginRequired events to communicate with
 * the rest of the application.
 */
angular.module('jDashboardFluxApp').service('permission', [
    "URL_SERVICE_AUTH", "$http", "actionRepository", "$rootScope", "authService", "$window",
    function init(URL_SERVICE_AUTH, $http, actionRepository, $rootScope, authService, $window) {

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
            considers = this.managesShop;
        } else if (type == 'Brand') {
            considers = this.managesBrand;
        } else if (type == 'Website') {
            considers = this.managesWebsite;
        } else {
            throw 'Unknown type : '+type;
        }
        for (var i = 0; i < considers.length; i++) {
            if (consider.id === id) {
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

                // Load actions active
                var action;
                var actions = [];
                var id;
                for (var i = 0; i < user.configures.length; i++) {
                    id = user.configures[i].id;
                    action = actionRepository.findById(id);
                    if (action === null) {
                        continue;
                    }
                    action.active = true;
                    actions.push(action);
                }
                user.configures = actions;

                // Attach methods
                user.isAllowed = isAllowed;

                $rootScope.$broadcast('event:auth-loginConfirmed');
                return user;
            });
        }
        return userPromise;
    };

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
    var logout = function() {
        user = null;
        userPromise = null;
        delete $window.sessionStorage.token;
        $rootScope.$broadcast('event:auth-loginRequired');
    };
    var isLoggedIn = function() { };


    return {
        user: user,
        getUser: getUser,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
    };
}]);
