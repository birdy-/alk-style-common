'use strict';

var ProductInShopSegment = function () {
    this._type = 'ProductInShopSegment';
    this.fromJson = function (json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};
ProductInShopSegment._type = 'ProductInShopSegment';

ProductInShopSegment.TYPE_AISLE      = new Constant(1, 'Rayon', 'Rayon du supermarché');
ProductInShopSegment.TYPE_THEMATIC   = new Constant(2, 'Thématique', 'Boutique thématique du supermarché');
ProductInShopSegment.TYPE_QUERY      = new Constant(3, 'Requête', "Requête définie par l'utilisateur");
ProductInShopSegment.TYPE_PROMOTION  = new Constant(4, 'Promotion', "Defines a list of ProductInShops that are in promotion.")
ProductInShopSegment.TYPE_NEW        = new Constant(5, 'Nouveauté', "Defines a list of ProductInShops that are new.")
ProductInShopSegment.TYPE_PERMISSION = new Constant(6, 'Permission', "Defines a list of ProductInShops a User has some rights on.")
ProductInShopSegment.TYPE_CONTACT    = new Constant(7, 'Contact', 'Defines a list of ProductInShops that share the same contact.')
