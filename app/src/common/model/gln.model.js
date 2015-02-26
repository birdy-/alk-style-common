'use strict';

var GLN = function (permission) {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'GLN';
    if (typeof permission !== 'undefined') { this.permission = permission; }
};
GLN._type = 'GLN';
