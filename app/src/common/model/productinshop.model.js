'use strict';

var ProductInShop = function () {
    this.fromJson = function (json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'ProductInShop';
};
ProductInShop._type = 'ProductInShop';
