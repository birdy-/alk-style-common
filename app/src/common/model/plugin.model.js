'use strict';

var Plugin = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Plugin';
};
Plugin._type = 'Plugin';
