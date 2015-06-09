'use strict';


/**
 * Service that wraps authentication-related processes. Contains the tooling required
 * to handle login, logout and user retrieval.
 *
 * Broadcasts auth-loginConfirmed and auth-loginRequired events to communicate with
 * the rest of the application.
 */
angular.module('jDashboardFluxApp').service('permission', [
    "URL_SERVICE_AUTH", "$http", "$rootScope", "authService", "$window", "$log", "$$ORM", "$alkCookie",
    function init(URL_SERVICE_AUTH, $http, $rootScope, authService, $window, $log, $$ORM, $alkCookie) {

    var userPromise = null;
    var user = null;

    /**
     * Returns a promise that is an image of the user.
     * @return user The global user.
     */
    var getUser = function () {
        if (userPromise === null) {
            userPromise = $$ORM.repository('User').method('Me')().then(function (user_) {
                user = user_;
                // Load relations
                user.managesBrand.forEach(function (relation) { relation.allowed = true; });
                user.managesWebsite.forEach(function (relation) { relation.allowed = true; });
                user.managesShop.forEach(function (relation) { relation.allowed = true; });
                user.belongsTo.forEach(function (relation) { relation.allowed = true; });

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
    var reset = function () {
        userPromise = null;
        user = null;
    };

    /**
     * Refresh user informations
     */
    var refreshUser = function() {
        userPromise = null;
        return getUser();
    };


    /**
     * Requests Authentication Token from authentication server
     * Post user-provided credentials
     */
    var login = function (login, password, rememberMe) {
        return $http.post(URL_SERVICE_AUTH + '/auth/v1/user/login', {
            username: login,
            password: password,
            grant_type: 'password',
            origin: 'dashboard_stream'
        }).success(function (response) {
            authService.loginConfirmed();
            $window.sessionStorage.token = response.access_token;
            $alkCookie.put("session_authtoken", response.access_token, 0);
            if (rememberMe) {
                $alkCookie.put("authtoken", response.access_token, 30);
            }
        }).error(function () {
            delete $window.sessionStorage.token;
        });
    };


    /**
     * Requests Authentication Token from authentication server
     * on a target user account
     */
    var connectAs = function (login, password, connect_as) {
        return $http.post(URL_SERVICE_AUTH + '/auth/v1/user/login', {
            username: login,
            password: password,
            grant_type: 'password',
            origin: 'dashboard_stream',
            connect_as: connect_as
        }).success(function (response) {
            authService.loginConfirmed();
            $window.sessionStorage.token = response.access_token;
            $alkCookie.put("session_authtoken", response.access_token, 0);
            $window.location.reload();
        }).error(function () {
            delete $window.sessionStorage.token;
        });
    };


    /**
     * Logs out the user from authenticated session
     *
     */
    var logout = function () {

        $log.debug('User clicked Logout');

        $alkCookie.remove("session_authtoken");
        $log.debug('Logged out, session authentication cookie erased');

        $alkCookie.remove("authtoken");
        $log.debug('Logged out, authentication cookie erased');

        delete $window.sessionStorage.token;
        $log.debug('Logged out, authentication token erased');

        reset();

        // do not want to display login form when user
        // manually logs out.
        //$rootScope.$broadcast('event:auth-loginRequired');
    };

    var getAccessToken = function () {
        var token = $window.sessionStorage.token;
        if (!token && $alkCookie.get("authtoken")) {
            token = $alkCookie.get("authtoken");
        }
        return token;
    };

    var getUserInfo = function () {
        if (!user) { return null; }
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            jobTitle: user.jobTitle,
            company: user.company,
            organizationId: user.belongsTo[0].id
        };
    };

    var isAdmin = function (organizationId) {
        var isAdmin = false;
        if (!user) { return isAdmin; }
        _.map(user.belongsTo, function (organization) {
            if (organization.id === Number(organizationId)) {
                if(_.indexOf(organization.permissions, 'admin') > -1) {
                    isAdmin = true;
                }
            }
        })

        return isAdmin;
    };

    var isRetailer = function () {
        return !!user && user.managesShop.length > 0;
    };

    return {
        reset: reset,
        refreshUser: refreshUser,
        getUser: getUser,
        getUserInfo: getUserInfo,
        login: login,
        connectAs: connectAs,
        logout: logout,
        getAccessToken: getAccessToken,
        isAdmin: isAdmin,
        isRetailer: isRetailer
    };
}]);
