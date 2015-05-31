'use strict';

/**
 * User entity
 * @constructor
 * @param {object} obj - User data
 * @return {User}
 */
var User = function (obj) {
    // Merging props
    this.fromJson(obj);

    this._type = 'User';

    return this;
};

User._type = 'User';

/**
 * Enable a permission on a product segment
 * @param {int} productSegmentId - Id of the product segment
 * @param {string} permission - Permission name
 */
User.prototype.enablePSPermission = function (productSegmentId, permission) {
    var productSegment = _.find(this.managesProductSegment, { id: productSegmentId });
    if (productSegment) {
      if (productSegment.permissions.indexOf(permission) === -1) {
        productSegment.permissions.push(permission);
      }
    }
};

/**
 * Disable a permission on a product segment
 * @param {int} productSegmentId - Id of the product segment
 * @param {string} permission - Permission name
 */
User.prototype.disablePSPermission = function (productSegmentId, permission) {
    var productSegment = _.find(this.managesProductSegment, { id: productSegmentId });
    if (productSegment) {
      var index = productSegment.permissions.indexOf(permission);
      if (index !== -1) {
        productSegment.permissions.splice(index, 1);
      }
    }
};

/**
 * Get the permission on a product segment
 * @param {int} productSegmentId - Id of the product segment
 */
User.prototype.getPSPermissions = function (productSegmentId) {
    var productSegment = _.find(this.managesProductSegment, { id: productSegmentId });
    if (productSegment) {
        return productSegment.permissions;
    }

    return [];
};

/**
 * Import JSON data to feed the current entity
 * @param {object} json - A JSON with user data
 * @return {User}
 */
User.prototype.fromJson = function (json) {
    for (var key in json) {
        this[key] = json[key];
    }
    return this;
};

User.prototype.isAllowed = function (type, id) {
    var considers = [];
    if (type === 'Shop') {
        considers = this.managesShop;
    } else if (type === 'Brand') {
        considers = this.managesBrand;
    } else if (type === 'Website') {
        considers = this.managesWebsite;
    } else {
        throw 'Unknown type : '+type;
    }
    for (var i = 0; i < considers.length; i++) {
        if (considers[i].id === id) {
            return true;
        }
    }
    return false;
};

User.prototype.allowedProductSegments = function (permission) {
    var returns = [];
    for (var i = 0; i < this.managesProductSegment.length; i++) {
        for (var j = 0; j < this.managesProductSegment[i].permissions.length; j++) {
            var psPermission = this.managesProductSegment[i].permissions[j];
            if (psPermission === permission  || psPermission === 'admin') {
                returns.push(this.managesProductSegment[i].id);
            }
        }
    }
    return returns;
};

User.prototype.isAdmin = function () {
    for (var i = 0; i < this.belongsTo.length; i++) {
        if (this.belongsTo[i].permissions.indexOf('admin') != -1) {
          return true;
        }
    }
    return false;
};

User.prototype.isAlkemicsAdmin = function () {
    return this.id < 100;
};

User.prototype.isRetailer = function () {
    return (this.managesShop.length > 0);
};

User.prototype.getHomeUrl = function () {
    if (this.isRetailer()) {
        return '/retailer/activity';
    }
    return '/maker/activity';
};

User.prototype.allowedWebsites = function (permission) {
    var returns = [];
    for (var i = 0; i < this.managesWebsite.length; i++) {
        for (var j = 0; j < this.managesWebsite[i].permissions.length; j++) {
            if (this.managesWebsite[i].permissions[j] === permission) {
                returns.push(this.managesWebsite[i].id);
            }
        }
    }
    return returns;
};
