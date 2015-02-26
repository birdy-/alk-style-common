'use strict';

var Concept = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Concept';
};
Concept._type = 'Concept';
