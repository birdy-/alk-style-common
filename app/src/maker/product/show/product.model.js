'use strict';

var Constant = function(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
};


var Product = function(){
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };

    this.isCertified = function() {
        return this.certified === Product.CERTIFICATION_STATUS_CERTIFIED.id
            || this.certified === Product.CERTIFICATION_STATUS_PUBLISHED.id;
    };
    this.isAccepted = function() {
        return this.certified === Product.CERTIFICATION_STATUS_ACCEPTED.id
            || this.certified === Product.CERTIFICATION_STATUS_CERTIFIED.id
            || this.certified === Product.CERTIFICATION_STATUS_PUBLISHED.id;
    };
};
Product.CERTIFICATION_STATUS_DEFAULT        = new Constant(0, "DEFAULT",       "The Product needs to be accepted and certified.");
Product.CERTIFICATION_STATUS_ACCEPTED       = new Constant(1, "ACCEPTED",      "The Product was accepted by its producer.");
Product.CERTIFICATION_STATUS_CERTIFIED      = new Constant(2, "CERTIFIED",     "The Product was certified by its producer.");
Product.CERTIFICATION_STATUS_PUBLISHED      = new Constant(3, "PUBLISHED",     "The Product was published by its producer.");

Product.STATUS_VALIDATED                    = new Constant(0, "VALIDATED",     "A Product that has been reviewed by an administrator.");
Product.STATUS_REVIEWED                     = new Constant(1, "REVIEWED",      "A Product that has been reviewed by its brand.");
Product.STATUS_TO_VALIDATE                  = new Constant(2, "TO_VALIDATE",   "A Product that requires validation.");
Product.STATUS_TO_MERGE                     = new Constant(3, "TO_MERGE",      "A Product that needs to be merged.");
Product.STATUS_TO_REVIEW                    = new Constant(4, "TO_REVIEW",     "A Product that needs to be reviewed.");


var ProductNutritionalQuantity = function() {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};


var ProductStandardQuantity = function(){
    this.contains = [];
    this.fromJson = function(json) {
        var pnq;
        for (var key in json) {
            if (key == 'contains') {
                for (var i = 0; i < json.contains.length; i++) {
                    pnq = new ProductNutritionalQuantity().fromJson(json.contains[i]);
                    this.contains.push(pnq);
                }
            } else {
                this[key] = json[key];
            }
        }
        return this;
    };
    this.getContainsById = function(id) {
        for (var i = 0; i < this.contains.length; i++) {
            if (this.contains[i].isConceptualizedBy.id === id) {
                return this.contains[i];
            }
        }
        return new ProductNutritionalQuantity();
    };
};