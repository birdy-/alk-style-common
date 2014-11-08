'use strict';

angular.module('jDashboardFluxApp').service('$$abstractRepository', [
    function service() {

        var session = {
            CommonUnit: {model: CommonUnit, lazy: {}, loaded: {} },
            Brand: {model: Brand, lazy: {}, loaded: {} },
            User: {model: User, lazy: {}, loaded: {} },
            Organization: {model: Organization, lazy: {}, loaded: {} },
            Product: {model: Product, lazy: {}, loaded: {} },
            Placement: {model: Placement, lazy: {}, loaded: {} },
            Shop: {model: Shop, lazy: {}, loaded: {} },
            Website: {model: Website, lazy: {}, loaded: {} },
            Campaign: {model: Campaign, lazy: {}, loaded: {} }
        };

        var getLazy = function(type, id, create) {
            id = parseInt(id, 10);
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
            reset: reset,
            getLazy: getLazy,
            popLazy: popLazy,
            getCache: getCache,
            popCache: popCache,
            registerCache: registerCache,
            registerLazy: registerLazy
        };
}]);

var Constant = function(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
};

var dateObjectFromUTC = function(s) {
    if (!s) {
        return null;
    }
    // Do not reparse if already Date()
    if (typeof(s) === 'object') {
        return s;
    }
    s = s.split(/\D/);
    if (typeof(s[3]) === 'undefined') {
        return new Date(Date.UTC(+s[0], --s[1], +s[2]));
    }
    return new Date(Date.UTC(+s[0], --s[1], +s[2], +s[3], +s[4], +s[5], 0));
};
