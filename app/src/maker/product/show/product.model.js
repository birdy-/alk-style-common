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


var ProductHasLabel = function() {
    this.id = null;
    this.isConceptualizedBy = {};
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};


var ProductNutritionalQuantity = function() {
    this.id = null;
    this.name = null;
    this.quantity = null;
    this.measurementPrecision = null;
    this.percentageOfDailyValueIntake = null;
    this.isConceptualizedBy = {};
    this.isMeasuredBy = {};
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};
ProductNutritionalQuantity.MEASUREMENTPRECISION_EXACT         = new Constant(0, "=", "If this nutriment measurement precision is exact");
ProductNutritionalQuantity.MEASUREMENTPRECISION_APPROXIMATELY = new Constant(1, "~", "If nutriment declaration as no precision");
ProductNutritionalQuantity.MEASUREMENTPRECISION_LESS_THAN     = new Constant(2, "<", "If this nutriment declaration contains '<'");



var ProductStandardQuantity = function(){
    this.id = null;
    this.name = null;
    this.quantity = null;
    this.preparationState = null;
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
            if (this.contains[i].isConceptualizedBy.id == id) {
                return this.contains[i];
            }
        }
        return null;
    };
};
ProductStandardQuantity.PREPARATIONSTATE_UNPREPARED = new Constant(0, "avant préparation", "If the nutrients supplied correspond to the nutrition values of the food in the state in which it is sold");
ProductStandardQuantity.PREPARATIONSTATE_PREPARED = new Constant(1, "après préparation", "If the nutrients supplied correspond to the nutrition values of the food in the state after preparation");


