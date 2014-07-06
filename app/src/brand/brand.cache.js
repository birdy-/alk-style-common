'use strict';

angular.module('jDashboardFluxApp').service('$brandRepository', [
    '$$sdkCrud',
    function service($$sdkCrud) {

        /**
         * If a Brand is lazily instantiated in the code somewhere,
         * keep it so we can fully load it sometime later without breaking
         * references.
         */
        var _lazy = {};
        var lazy = function(id) {
            id = parseInt(id);
            if (typeof(_cache[id]) !== 'undefined') {
                return _cache[id];
            }
            if (typeof(_lazy[id]) !== 'undefined') {
                return _lazy[id];
            }
            var brand = new Brand();
            brand.id = id;
            _lazy[id] = brand;
            return brand;
        };

        var _cache = {};
        var reset = function() {
            _cache = {};
        };

        var get = function (id, callback) {
            id = parseInt(id);
            // Return if cached
            if (typeof(_cache[id]) !== 'undefined') {
                if (callback) {
                    return callback(_cache[id]);
                }
                return _cache[id];
            }
            return $$sdkCrud.BrandShow(id).success(function (response) {
                // Check if not lazilly instantiated somewhere.
                var brand;
                if (typeof(_lazy[id]) !== 'undefined') {
                    brand = _lazy[id];
                } else {
                    brand = new Brand();
                }
                brand.fromJson(response.data);
                brand.text = brand.name;
                if (brand.isSubBrandOf) {
                    brand.isSubBrandOf = lazy(brand.isSubBrandOf.id);
                }

                // Cache Brand for future reuse
                _cache[id] = brand;
                if (callback) {
                    callback(brand);
                }
                return brand;
            });
        };

        var list = function () {
            var l;
            for (var id in _cache) {
                l.push(cache[id]);
            };
            return l;
        };

        return {
            get: get,
            list: list,
            reset: reset,
            lazy: lazy,
        };
}]);


var Brand = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};
