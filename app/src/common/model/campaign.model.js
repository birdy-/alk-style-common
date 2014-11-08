"use strict";

var Campaign = function() {
    this.id = null;
    this.name = null;
    this.type = null;

    this.billedBy = {};

    this.bid = null;
    this.parameters = {};
    this.enabled = null;
    this.active = null;

    this.runsOnBrand = [];
    this.runsOnProduct = [];
    this.runsOnProductSegment = [];
    this.runsOnProductInShop = [];
    this.runsOnProductInShopSegment = [];
    this.runsOnConcept = [];
    this.runsIn = [];
    this.advertises = null;

    this.createdAt = null;
    this.updatedAt = null;
    this.startsAt = null;
    this.endsAt = null;

    this.volumeDisplay = 0;

    this._type = 'Campaign';

    this.typeName = function() {
        var types = this.types();
        for (var i = 0; i < types.length; i++) {
            if (types[i].id == this.type) {
                return types[i].name;
            }
        }
        return '';
    };
    this.types = function() {
        return [
            Campaign.TYPE_PROMOTE,
            Campaign.TYPE_FILTER,
            Campaign.TYPE_TARGETING,
            Campaign.TYPE_QRCODE,
            Campaign.TYPE_SHOPPINGLIST,
            Campaign.TYPE_BUTTON,
            Campaign.TYPE_LANDINGPAGE
        ];
    };
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        this.endsAt = dateObjectFromUTC(json['endsAt']);
        this.startsAt = dateObjectFromUTC(json['startsAt']);
        this.createdAt = dateObjectFromUTC(json['createdAt']);
        this.updatedAt = dateObjectFromUTC(json['updatedAt']);
        return this;
    };
};
Campaign.TYPE_PROMOTE = new Constant(1, 'Mise en avant', 'Mise en avant des produits de la marque');
Campaign.TYPE_FILTER = new Constant(2, 'Exclu', 'Affichage exclusif des produits de la marque');
Campaign.TYPE_TARGETING = new Constant(3, 'Ciblage', '');
Campaign.TYPE_QRCODE = new Constant(4, 'QR-code', '');
Campaign.TYPE_SHOPPINGLIST = new Constant(5, 'Liste de courses', '');
Campaign.TYPE_BUTTON = new Constant(6, 'Bouton', '');
Campaign.TYPE_LANDINGPAGE = new Constant(7, 'Landing page', '');



