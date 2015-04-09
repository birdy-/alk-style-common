'use strict';

var ProductSegment = function() {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'ProductSegment';
};
ProductSegment._type = 'ProductSegment';

// Permissions
ProductSegment.PERMISSION_PS_SHOW                   = 'productsegment.show';
ProductSegment.PERMISSION_PS_UPDATE                 = 'productsegment.update';
ProductSegment.PERMISSION_PS_DELETE                 = 'productsegment.delete';
ProductSegment.PERMISSION_USER_SHOW                 = 'user.show';
ProductSegment.PERMISSION_USER_CREATE               = 'user.create';
ProductSegment.PERMISSION_USER_UPDATE               = 'user.update';
ProductSegment.PERMISSION_USER_DELETE               = 'user.delete';
ProductSegment.PERMISSION_PRODUCT_SHOW              = 'product.show';
ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL      = 'product.show.textual';
ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC     = 'product.show.semantic';
ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED   = 'product.show.normalized';
ProductSegment.PERMISSION_PRODUCT_CREATE            = 'product.create';
ProductSegment.PERMISSION_PRODUCT_UPDATE            = 'product.update';
ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL    = 'product.update.textual';
ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC   = 'product.update.semantic';
ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED = 'product.update.normalized';
ProductSegment.PERMISSION_PRODUCT_DELETE            = 'product.delete';
ProductSegment.PERMISSION_PRODUCT_CERTIFY           = 'product.certify';