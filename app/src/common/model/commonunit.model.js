'use strict';

var CommonUnit = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'CommonUnit';
};
CommonUnit._type = 'CommonUnit';