'use strict';

angular.module('jDashboardFluxApp').service('$$BrandRepository', [
    '$$sdkCrud', '$$entityManager', '$q',
    function service($$sdkCrud, $$entityManager, $q) {

        var Model = Brand;
        var $$sdk = $$sdkCrud;
        var modelName = 'Brand';

        var get = function (id, options) {
            id = parseInt(id);
            // Return directly if cached (it means it was fully loaded)
            var entity = $$entityManager.getCache(modelName, id);
            if (entity) {
                var deferred = $q.defer();
                deferred.resolve(entity);
                return deferred.promise;
            }
            return $$sdk[modelName + 'Show'](id, options).then(function (response) {
                var data = response.data.data;
                // Check if not lazilly instantiated somewhere.
                var entity = $$entityManager.getLazy(modelName, id, true);
                entity.fromJson(data);

                // Fill properties
                entity.text = entity.name;
                if (entity.isSubBrandOf) {
                    entity.isSubBrandOf = $$entityManager.getLazy(entity.isSubBrandOf._type, entity.isSubBrandOf.id, true);
                }
                if (entity.subBrands) {
                    var json;
                    entity.subBrands = [];
                    for(var i = 0; i < data.subBrands.length; i++) {
                        json = data.subBrands[i];
                        entity.subBrands.push($$entityManager.getLazy(json._type, json.id, true));
                    }
                }

                // Cache entity for future reuse
                $$entityManager.registerCache(entity);
                return entity;
            });
        };

        var list = function(queries, filters, sorts, offset, limit) {
            return $$sdkCrud[modelName + 'List'](
                queries, filters, sorts, offset, limit
            ).then(function(response){
                var l = [];
                response.data.data.forEach(function(json){
                    var entity = $$entityManager.getLazy(json._type, json.id, true);
                    entity.fromJson(json);
                    l.push(entity);;
                });
                return l;
            });
        };

        var del = function(id) {
            $$entityManager.popCache(modelName, id);
            return $$sdkCrud[modelName + 'Delete'](
                id
            );
        };

        var lazy = function(id, create) {
            return $$entityManager.getLazy(modelName, id, true);
        };

        return {
            get: get,
            lazy: lazy,
            del: del,
            list: list
        };
}]);
