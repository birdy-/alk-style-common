'use strict';

var Gtin = function(){
  this._type = 'Gtin';

  this.fromJson = function (json) {
    for (var key in json) {
      this[key] = json[key];
    }
    return this;
  };

  this.getType = function (type) {
    var types = [
      Gtin.TYPE_UNKNOWN,
      Gtin.TYPE_ADDED_THROUGH_PLATFORM,
      Gtin.TYPE_GEPIR,
      Gtin.TYPE_GDSN,
      Gtin.TYPE_DEDUCTED_THROUGH_PLATFORM
    ];
    return types[type];
  };

};

Gtin._type = 'Gtin';

Gtin.TYPE_UNKNOWN = new Constant(0,'UNKNOWN');
Gtin.TYPE_ADDED_THROUGH_PLATFORM = new Constant(7,'ADDED_THROUGH_PLATFORM');
Gtin.TYPE_GEPIR = new Constant(8,'GEPIR');
Gtin.TYPE_GDSN = new Constant(9,'GDSN');
Gtin.TYPE_DEDUCTED_THROUGH_PLATFORM = new Constant(10,'DEDUCTED_THROUGH_PLATFORM');

Gtin.status = function () {
  return [
    Gtin.TYPE_UNKNOWN,
    Gtin.TYPE_ADDED_THROUGH_PLATFORM,
    Gtin.TYPE_GEPIR,
    Gtin.TYPE_GDSN,
    Gtin.TYPE_DEDUCTED_THROUGH_PLATFORM
  ];
};

Gtin.getType = function (type) {
    var types = [
      Gtin.TYPE_UNKNOWN,
      Gtin.TYPE_ADDED_THROUGH_PLATFORM,
      Gtin.TYPE_GEPIR,
      Gtin.TYPE_GDSN,
      Gtin.TYPE_DEDUCTED_THROUGH_PLATFORM
    ];
  return types[type];
};
