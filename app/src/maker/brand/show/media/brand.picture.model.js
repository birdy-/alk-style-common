'use strict';

var BrandPicture = function() {
    this._type = 'BrandPicture';
    this.fromJson = function(json) {
        for (var key in json) {
            if (key === 'fileEffectiveStartDateTime'
            || key === 'fileEffectiveEndDateTime'
            || key === 'createdAt') {
                json[key] = new Date(json[key]);
            }
            this[key] = json[key];
        }
        return this;
    };
};

BrandPicture.ORIGIN_UNKNOWN      = new Constant(0, name="ORIGIN_UNKNOWN",         "Origin is not traceable");
BrandPicture.ORIGIN_STREAM_USER  = new Constant(1, name="ORIGIN_STREAM_USER",     "Image comes from a stream user");
BrandPicture.ORIGIN_GDSN         = new Constant(2, name="ORIGIN_GDSN",            "Image comes from a GDSN import");
BrandPicture.ORIGIN_BRANDBANK    = new Constant(3, name="ORIGIN_BRANDBANK",       "Image comes from a BrandBank import");

