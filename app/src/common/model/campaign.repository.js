'use strict';

angular.module('jDashboardFluxApp').service('$$CampaignRepository', [
    '$$sdkCampaign', '$$abstractRepository', '$q',
    function service($$sdkCampaign, $$abstractRepository, $q) {

        var Model = Campaign;
        var $$sdk = $$sdkCampaign;
        var modelName = 'Campaign';

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
            if (data.advertises.id) {
                entity.advertises = $$abstractRepository.getLazy(data.advertises._type, data.advertises.id, true);
            }
            if (data.runsIn) {
                entity.runsIn = data.runsIn.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnConcept) {
                entity.runsOnConcept = data.runsOnConcept.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnBrand) {
                entity.runsOnBrand = data.runsOnBrand.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnProduct) {
                entity.runsOnProduct = data.runsOnProduct.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnProductSegment) {
                entity.runsOnProductSegment = data.runsOnProductSegment.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnProductInShop) {
                entity.runsOnProductInShop = data.runsOnProductInShop.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }
            if (data.runsOnProductInShopSegment) {
                entity.runsOnProductInShopSegment = data.runsOnProductInShopSegment.map(function(json) {
                    var relation = $$abstractRepository.getLazy(json._type, json.id, true);
                    relation.fromJson(json);
                    return relation;
                });
            }

            entity.endsAt = dateObjectFromUTC(data.endsAt);
            entity.startsAt = dateObjectFromUTC(data.startsAt);
            entity.createdAt = dateObjectFromUTC(data.createdAt);
            entity.updatedAt = dateObjectFromUTC(data.updatedAt);

            // Cache entity for future reuse
            if (full) {
                $$abstractRepository.registerCache(entity);
            } else {
                $$abstractRepository.registerLazy(entity);
            }
            return entity;
        };

        var hydrateResponse = function(response) {
            return hydrate(response.data.data, true);
        };

        var list = function(queries, filters, sorts, offset, limit) {
            return $$sdk[modelName + 'List'](
                queries, filters, sorts, offset, limit
            ).then(function(response) {
                return response.data.data.map(function(json) {
                    return hydrate(json, false);
                });
            });
        };
        var del = function(id) {
            $$abstractRepository.popCache(modelName, id);
            return $$sdk[modelName + 'Delete'](
                id
            );
        };
        var update = function(entity) {
            return $$sdk[modelName + 'Update'](
                entity
            ).then(function(response) {
                entity.fromJson(response.data.data);
            });
        };
        var create = function(entity) {
            return $$sdk[modelName + 'Create'](
                entity
            ).then(function(response) {
                entity.fromJson(response.data.data);
            });
        };

        var lazy = function(id, create) {
            return $$abstractRepository.getLazy(modelName, id, true);
        };

        return {
            get: get,
            update: update,
            create: create,
            lazy: lazy,
            del: del,
            list: list
        };
}]);
