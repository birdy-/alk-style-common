'use strict';

angular.module('jDashboardFluxApp').service('$$CommonUnitRepository', [
    '$$sdkCrud', '$$abstractRepository', '$q',
    function service($$sdkCrud, $$abstractRepository, $q) {

        var Model = CommonUnit;
        var $$sdk = $$sdkCrud;
        var modelName = 'CommonUnit';

        var get = function (id, options) {
            console.log(id);
            id = parseInt(id);
            // Return directly if cached (it means it was fully loaded)
            var entity = $$abstractRepository.getCache(modelName, id);
            if (entity) {
                var deferred = $q.defer();
                deferred.resolve(entity);
                return deferred.promise;
            }
            return $$sdk[modelName + 'Show'](id, options).then(hydrate2);
        };

        var hydrate = function(data, full) {
            // Check if not lazilly instantiated somewhere.
            var entity = $$abstractRepository.getLazy(modelName, data.id, true);
            entity.fromJson(data);

            // Fill properties
            entity.text = entity.name;

            // Cache entity for future reuse
            $$abstractRepository.registerCache(entity);
            return entity;
        }

        var hydrate2 = function(response) {
            return hydrate(response.data.data, true);
        };

        var list = function(queries, filters, sorts, offset, limit) {
            return $$sdk[modelName + 'List'](
                queries, filters, sorts, offset, limit
            ).then(function(response){
                return response.data.data.map(function(json){
                    var entity = hydrate(json);
                    $$abstractRepository.registerCache(entity);
                    return entity;
                });
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
