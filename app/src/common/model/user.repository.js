'use strict';

angular.module('jDashboardFluxApp').service('$$UserRepository', [
    '$$sdkAuth', '$$abstractRepository', '$q',
    function service($$sdkAuth, $$abstractRepository, $q) {

        var Model = User;
        var $$sdk = $$sdkAuth;
        var modelName = 'User';

        var get = function (id, options) {
            id = parseInt(id);
            options = options ? options : {};
            // Return directly if cached (it means it was fully loaded)
            var entity = $$abstractRepository.getCache(modelName, id);
            if (entity) {
                var deferred = $q.defer();
                deferred.resolve(entity);
                return deferred.promise;
            }
            return $$sdk[modelName + 'Show'](id).then(hydrateResponse);
        };

        var hydrate = function(data, full) {
            // Check if not lazilly instantiated somewhere.
            var id = data.id;
            var entity = $$abstractRepository.getLazy(modelName, id, true);
            entity.fromJson(data);

            if (entity.managesBrand) {
                entity.managesBrand = data.managesBrand.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (entity.managesWebsite) {
                entity.managesWebsite = data.managesWebsite.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (entity.managesShop) {
                entity.managesShop = data.managesShop.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (entity.belongsTo) {
                entity.belongsTo = data.belongsTo.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }

            // Cache entity for future reuse
            if (full) {
                $$abstractRepository.registerCache(entity);
            }
            return entity;
        };

        var hydrateResponse = function(response) {
            return hydrate(response.data.data, true);
        };

        var list = function(queries, filters, sorts, offset, limit) {
            return $$sdk[modelName + 'List'](
                queries, filters, sorts, offset, limit
            ).then(function(response){
                var l = [];
                response.data.data.forEach(function(json){
                    var entity = $$abstractRepository.getLazy(json._type, json.id, true);
                    entity.fromJson(json);
                    l.push(entity);;
                });
                return l;
            });
        };

        var del = function(id) {
            $$abstractRepository.popCache(modelName, id);
            return $$sdk[modelName + 'Delete'](
                id
            );
        };

        var lazy = function(id, create) {
            return $$abstractRepository.getLazy(modelName, id, true);
        };

        var popCache = function(id) {
            return $$abstractRepository.popCache(modelName, id);
        };

        return {
            popCache: popCache,
            get: get,
            lazy: lazy,
            hydrate: hydrate,
            del: del,
            list: list
        };
}]);
