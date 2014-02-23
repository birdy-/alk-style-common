'use strict';

angular.module('jDashboardFluxApp').service('permission', [
    "API_URL", "$http", "headerRepository", "actionRepository",
    function permission(API_URL, $http, headerRepository, actionRepository) {

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
            considers = this.ownsShop;
        } else if (type == 'Brand') {
            considers = this.ownsBrand;
        } else if (type == 'Website') {
            considers = this.ownsWebsite;
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
    /**
     * Returns a promise that is an image of the user.
     * @return user The global user.
     */
    function getUser() {
        if (userPromise == null) {
            var url = API_URL
                + '/api/1/user/me'
                + '?callback=' + 'JSON_CALLBACK';
            userPromise = $http.jsonp(url).then(function(body, status, headers, config) {
                var user = body.data.data;

                // Load permissions
                var permission;
                var header;
                for (var i = 0; i < user.permissions.length; i++) {
                    permission = user.permissions[i];
                    header = headerRepository.findById(permission.on_id);
                    header.available = true;
                    header.permissions[permission.for] = true;
                }

                // Load actions allowed
                var action;
                var actions = [];
                var id;
                for (var i = 0; i < user.actionsAuthorized.length; i++) {
                    id = user.actionsAuthorized[i].id;
                    action = actionRepository.findById(id);
                    if (action === null) {
                        continue;
                    }
                    action.available = true;
                    actions.push(action);
                }
                user.actionsAuthorized = actions;

                // Attach methods
                user.isAllowed = isAllowed
                return user;
            }); //.then(function(user){ console.log(user); });
        }
        return userPromise;
    }

    return {
        getUser: getUser
    }
}]);
