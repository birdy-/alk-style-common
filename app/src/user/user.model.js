'use strict';

var User = function(){
    // NB : it is very important not to set the values below to [] otherwise
    // it will overwrite the related entities by a []...
    this._type = 'User';
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };

    this.isAllowed = function(type, id) {
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

    // For now, no filter on ProductSegments, just use them for permission
    // The if clause can be removed, it's just for backward compatibility
    this.allowedProductSegments = function(permission) {
        var returns = [];
        for (var i = 0; i < this.managesProductSegment.length; i++) {
            for (var j = 0; j < this.managesProductSegment[i].permissions.length; j++) {
                console.log("this.managesProductSegment[i].permissions[j]", this.managesProductSegment[i].permissions[j])
                if (this.managesProductSegment[i].permissions[j] === permission) {
                    returns.push(this.managesProductSegment[i].id);
                }
            }
        }
        return returns;
    }

    this.allowedWebsites = function(permission) {
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
};
User._type = 'User';
