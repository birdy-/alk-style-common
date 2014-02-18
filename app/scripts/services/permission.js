'use strict';

angular.module('jDashboardFluxApp').service('permission', [
    "API_URL", "$http", "headerRepository", "actionRepository", "$q",
    function Segments(API_URL, $http, headerRepository, actionRepository, $q) {

    var isAllowed = function(entity, id) {
        var considers = [];
        if (entity == 'Shop') {
            considers = this.ownsShop;
        } else if (entity == 'Brand') {
            considers = this.ownsBrand;
        } else if (entity == 'Website') {
            considers = this.ownsWebsite;
        } else {
            throw 'Unknown type : '+entity;
        }
        for (var i = 0; i < considers.length; i++) {
            if (consider.id === id) {
                return true;
            }
        }
        return false;
    };

    var user = {
        id: null,
        username: null,
        permissions: [],
        actions: [],
        actionsAuthorized: [],
        ownsShop: [],
        ownsWebsite: [],
        ownsBrand: [],
        ok: false
    };

    /**
     * Retrieves the list of permissions of the user. It will update the
     * menus the user is allowed to see.
     */
    var list = function(deferred) {
        var url = API_URL
                + '/api/1/user/me'
                + '?callback=' + 'JSON_CALLBACK';
        $http.jsonp(url).success(function(body, status, headers, config) {

            var _user = body.data;

            user.id = _user.id;
            user.username = _user.username;
            user.ownsShop = _user.ownsShop;
            user.ownsWebsite = _user.ownsWebsite;
            user.ownsBrand = _user.ownsBrand;

            // Load permissions
            var permission;
            var header;
            for (var i = 0; i < _user.permissions.length; i++) {
                permission = _user.permissions[i];
                header = headerRepository.findById(permission.on_id);
                header.available = true;
                header.permissions[permission.for] = true;
                user.permissions.push(permission);
            }
            // Load actions allowed
            var action;
            var id;
            for (var i = 0; i < _user.actionsAuthorized.length; i++) {
                id = _user.actionsAuthorized[i].id;
                action = actionRepository.findById(id);

                if (action === null) {
                    continue;
                }
                action.available = true;
                user.actionsAuthorized.push(action);
            }
            user.ok = true; // caching next call
            deferred.resolve(user);
        });
    };

    // Use a promise
    var getUser = function () {
        var deferred = $q.defer();
        if (user.ok) {
            deferred.resolve(user);
        } else {
            // will resolve deferred with populated user
            list(deferred);
        }
        return deferred.promise;
    };
    getUser();

    return {
        getUser: getUser,
        isAllowed: isAllowed
    }
}]);
