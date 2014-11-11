'use strict';

var Website = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Website';
};
Website._type = 'Website';
