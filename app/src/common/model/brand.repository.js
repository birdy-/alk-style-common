'use strict';

angular.module('jDashboardFluxApp').service('$$BrandRepository', [
    '$$sdkCrud', '$$abstractRepository', '$q',
    function service($$sdkCrud, $$abstractRepository, $q) {

        var Model = Brand;
        var $$sdk = $$sdkCrud;
        var modelName = 'Brand';

        var get = function (id, options) {
            id = parseInt(id, 10);
            // Return directly if cached (it means it was fully loaded)
            var entity = $$abstractRepository.getCache(modelName, id);
            if (entity) {
                var deferred = $q.defer();
                deferred.resolve(entity);
                return deferred.promise;
            }
            return $$sdk[modelName + 'Show'](id, options).then(hydrateResponse);
        };

        var hydrate = function(data, full) {
            // Check if not lazilly instantiated somewhere.
            var entity = $$abstractRepository.getLazy(modelName, data.id, true);
            entity.fromJson(data);

            // Fill properties
            entity.text = entity.name;
            if (data.isSubBrandOf) {
                entity.isSubBrandOf = $$abstractRepository.getLazy(entity.isSubBrandOf._type, entity.isSubBrandOf.id, true);
            }
            if (data.subBrands) {
                entity.subBrands = data.subBrands.map(function(json)  {
                    return $$abstractRepository.getLazy(json._type, json.id, true);
                });
            }

            // Cache entity for future reuse
            $$abstractRepository.registerCache(entity);
            return entity;
        };

        var hydrateResponse = function(response) {
            return hydrate(response.data.data, true);
        };

        var list = function(queries, filters, sorts, offset, limit, withs) {
            return $$sdk[modelName + 'List'](
                queries, filters, sorts, offset, limit, withs
            ).then(function(response){
                return response.data.data.map(function(json){
                    return hydrate(json);
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
