'use strict';

var Brand = function () {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Brand';
};
Brand._type = 'Brand';
