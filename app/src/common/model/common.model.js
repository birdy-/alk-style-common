'use strict';

angular.module('jDashboardFluxApp').service('$$entityManager', [
    '$$sdkCrud',
    function service($$sdkCrud) {

        var session = {
            Brand: {
                model: Brand,
                lazy: {},
                loaded: {},
            },
        };

        var getLazy = function(type, id, create) {
            id = parseInt(id);
            if (typeof(session[type].loaded[id]) !== 'undefined') {
                return session[type].loaded[id];
            }
            if (typeof(session[type].lazy[id]) !== 'undefined') {
                return session[type].lazy[id];
            }
            if (create) {
                var entity = new session[type].model();
                entity.id = id;
                registerLazy(entity);
                return entity;
            }
            return null;
        };
        var registerLazy = function(entity) {
            session[entity._type].lazy[entity.id] = entity;
        };
        var popLazy = function(type, id) {
            delete session[type].lazy[id];
        };

        var reset = function(type) {
            session[type].loaded = {};
        };
        var getCache = function(type, id) {
            return session[type].loaded[id];
        };
        var registerCache = function(entity) {
            session[entity._type].loaded[entity.id] = entity;
        };
        var popCache = function(type, id) {
            delete session[type].loaded[id];
            popLazy(type, id);
        };
        return {
            getLazy: getLazy,
            getCache: getCache,
            registerCache: registerCache,
            registerLazy: registerLazy,
        };
}]);

var Constant = function(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
};


