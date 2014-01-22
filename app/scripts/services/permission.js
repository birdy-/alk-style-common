'use strict';

angular
    .module('jDashboardFluxApp')
        .service('permission', ["API_URL", "$http", "headerRepository", "actionRepository", "$q", function permission(API_URL, $http, headerRepository, actionRepository, $q) {

            var isAllowed = function(entity, id) {
                var considers = [];
                if (entity == 'Shop') {
                    considers = this.shopIds_owned;
                } else if (entity == 'Brand') {
                    considers = this.brandIds_owned;
                } else if (entity == 'Website') {
                    considers = this.websiteIds_owned;
                } else {
                    throw 'Unknown type : '+entity;
                }
                return considers.indexOf(id) !== -1;
            };

            var user = {
                id: null,
                username: null,
                permissions: [],
                actions: [],
                actions_allowed: [],
                shopIds_owned: [],
                websiteIds_owned: [],
                brandIds_owned: [],
                ok: false,
                isAllowed: isAllowed
            };

            /**
             * Retrieves the list of permissions of the user. It will update the
             * menus the user is allowed to see.
             */
            var list = function(deferred) {
                var url = API_URL
                        + '/api/1/account'
                        + '?callback=' + 'JSON_CALLBACK';
                $http.jsonp(url).success(function(body, status, headers, config) {
                    // Update user object
                    user.id = body.data.id;
                    user.username = body.data.username;

                    user.shopIds_owned = body.data.shopIds_owned;
                    user.websiteIds_owned = body.data.websiteIds_owned;
                    user.brandIds_owned = body.data.brandIds_owned;

                    user.shopsOwned = [];
                    for (var i = 0; i < user.shopIds_owned.length; i++) {
                        user.shopsOwned.push({
                            id: user.shopIds_owned[i],
                            _type: 'Shop'
                        });
                    }
                    user.websitesOwned = [];
                    for (var i = 0; i < user.websiteIds_owned.length; i++) {
                        user.websitesOwned.push({
                            id: user.websiteIds_owned[i],
                            _type: 'Website'
                        });
                    }
                    user.brandsOwned = [];
                    for (var i = 0; i < user.brandIds_owned.length; i++) {
                        user.brandsOwned.push({
                            id: user.brandIds_owned[i],
                            _type: 'Brand'
                        });
                    }

                    // Load permissions
                    var permission;
                    var header;
                    for (var i = 0; i < body.data.permissions.length; i++) {
                        permission = body.data.permissions[i];
                        header = headerRepository.findById(permission.on_id);
                        header.available = true;
                        header.permissions[permission.for] = true;
                        user.permissions.push(permission);
                    }
                    // Load actions allowed
                    var action;
                    var id;
                    for (var i = 0; i < body.data.actions_allowed.length; i++) {
                        id = body.data.actions_allowed[i].id;
                        action = actionRepository.findById(id);
                        if (action !== null) {
                            action.available = true;
                            user.actions_allowed.push(action);
                        }
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
