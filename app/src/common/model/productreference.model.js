'use strict';

var ProductReference = function() {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'ProductReference';
};
ProductReference._type = 'ProductReference';

ProductReference.STATUS_PRIVATE = new Constant(0, 'PRIVATE', 'A ProductReference that is private.');
ProductReference.STATUS_PUBLIC  = new Constant(1, 'PUBLIC', 'A ProductReference that is public.');

ProductReference.TYPE_EAN     = new Constant(1, "EAN", "A generic digit EAN.");
ProductReference.TYPE_EAN8    = new Constant(1, "EAN8", "A 8-digit EAN.");
ProductReference.TYPE_EAN12   = new Constant(1, "EAN12", "A 12-digit EAN.");
ProductReference.TYPE_EAN13   = new Constant(1, "EAN13", "A 13-digit EAN.");
ProductReference.TYPE_EAN14   = new Constant(1, "EAN14", "A 14-digit EAN.");

ProductReference.TYPE_GTIN     = new Constant(1, "GTIN", "A generic GTIN.");
ProductReference.TYPE_GTIN8    = new Constant(1, "GTIN8", "A 8-digit GTIN.");
ProductReference.TYPE_GTIN12   = new Constant(1, "GTIN12", "A 12-digit GTIN.");
ProductReference.TYPE_GTIN13   = new Constant(1, "GTIN13", "A 13-digit GTIN.");
ProductReference.TYPE_GTIN14   = new Constant(1, "GTIN14", "A 14-digit GTIN.");
