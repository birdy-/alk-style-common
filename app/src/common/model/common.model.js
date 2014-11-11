'use strict';

angular.module('jDashboardFluxApp').service('$$cacheManager', [
    '$log',
    function service ($log) {

    // ------------------------------------------------------------------------
    // Cache
    // ------------------------------------------------------------------------
        var session = {};

        var registerEntity = function (Model) {
            session[Model._type] = {
                model: Model, lazy: {}, loaded: {}
            }
        };

    // ------------------------------------------------------------------------
    // Cache management
    // ------------------------------------------------------------------------
        var getLazy = function (type, id, create) {
            id = parseInt(id, 10);
            if (typeof(session[type]) === 'undefined') {
                $log.error('Unknown Entity : ' + type, id);
                throw 'Unknown Entity : ' + type;
            }
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
        var registerLazy = function (entity) {
            session[entity._type].lazy[entity.id] = entity;
        };
        var popLazy = function (type, id) {
            delete session[type].lazy[id];
        };

        var reset = function (type) {
            session[type].loaded = {};
        };
        var getCache = function (type, id) {
            return session[type].loaded[id];
        };
        var registerCache = function (entity) {
            session[entity._type].loaded[entity.id] = entity;
        };
        var popCache = function (type, id) {
            delete session[type].loaded[id];
            popLazy(type, id);
        };

    // ------------------------------------------------------------------------
    // Hydration
    // ------------------------------------------------------------------------
        var hydrate = function (data, full) {
            // If simple dictionary, don't do anything
            if (typeof(data._type) === 'undefined') {
                return data;
            }
            // If not registered, skip
            if (typeof(session[data._type]) === 'undefined') {
                $log.warn('Unregistered Entity : ' + data._type);
                return data;
            }
            // Hydrate properties
            var entity = getLazy(data._type, data.id, true);
            entity.fromJson(data);

            // Hydrate relations
            var value;
            for (var key in data) {
                value = data[key];
                // Skip methods and null values
                if (!data.hasOwnProperty(key)
                || value === null) {
                    continue;
                }
                // Check if this is an array
                if (value instanceof Array) {
                    entity[key] = value.map(function (json) {
                        return hydrate(json, false);
                    });
                    continue;
                }
                // Check if this is an object that has already been hydrated
                if (typeof(value) === 'object'
                && typeof(value.fromJson) === 'undefined') {
                    entity[key] = hydrate(value, false);
                }
            }
            return entity;
        };

        var hydrateResponse = function (response) {
            return hydrate(response.data.data, true);
        };


    // ------------------------------------------------------------------------
    // Hydration
    // ------------------------------------------------------------------------
        return {
            reset: reset,
            getLazy: getLazy,
            popLazy: popLazy,
            getCache: getCache,
            popCache: popCache,
            hydrate: hydrate,
            hydrateResponse: hydrateResponse,
            registerCache: registerCache,
            registerLazy: registerLazy,
            registerEntity: registerEntity
        };
    }
]);

var Constant = function (id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
};

var dateObjectFromUTC = function (s) {
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
