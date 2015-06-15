'use strict';

var ProductSegment = function () {
    this.fromJson = function (json) {
        for (var key in json) {
            this[key] = json[key];
        }

        this.formatStats();
        this.computeUsers();
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

/**
 * Format statistics and compute more detailled ones
 */
ProductSegment.prototype.formatStats = function () {
    if (!this.statistics) { return; }
    this.statistics.certifieds = +this.statistics.counts[Product.CERTIFICATION_STATUS_CERTIFIED.id];
    this.statistics.notCertifieds = +this.statistics.counts[Product.CERTIFICATION_STATUS_ACCEPTED.id];
    this.statistics.total = this.statistics.certifieds + this.statistics.notCertifieds;

    this.statistics.certifiedsPercent = Math.ceil(100*this.statistics.certifieds / this.statistics.total) || 0;
    this.statistics.notCertifiedsPercent = 100 - this.statistics.certifiedsPercent;
};

/**
 * Format users count
 */
ProductSegment.prototype.computeUsers = function () {
    var _ = window._;
    if (!this.usersPermissions) { return; }
    var users = [];
    _.map(this.usersPermissions, function (permission) {
        _.map(permission, function (user) {
            users.push(user);
        });
    });

    this.usersCount = _.uniq(users).length;
};
