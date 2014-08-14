'use strict';

angular.module('jDashboardFluxApp').service('$$OrganizationRepository', [
    '$$sdkAuth', '$$abstractRepository', '$q',
    function service($$sdkAuth, $$abstractRepository, $q) {

        var Model = Organization;
        var $$sdk = $$sdkAuth;
        var modelName = 'Organization';

        var get = function (id, options) {
            id = parseInt(id);
            // Return directly if cached (it means it was fully loaded)
            var entity = $$abstractRepository.getCache(modelName, id);
            if (entity) {
                var deferred = $q.defer();
                deferred.resolve(entity);
                return deferred.promise;
            }
            return $$sdk[modelName + 'Show'](id, options).then(function (response) {
                var data = response.data.data;
                // Check if not lazilly instantiated somewhere.
                var entity = $$abstractRepository.getLazy(modelName, id, true);
                entity.fromJson(data);
                entity.text = entity.name;

                // Cache entity for future reuse
                $$abstractRepository.registerCache(entity);
                return entity;
            });
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

        return {
            get: get,
            lazy: lazy,
            del: del,
            list: list
        };
}]);
