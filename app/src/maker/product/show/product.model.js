'use strict';

var Product = function(){
    // NB : it is very important not to set the vaues below to [] otherwise
    // it will overwrite the related entities by a []...
    this.isPartitionedBy = null;
    this.isInstantiatedBy = null;
    this._type = 'Product';
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };

    this.isValidated = function() {
        return this.status === Product.STATUS_VALIDATED.id
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
    this.isTypePackagingEach = function() {
        return this.typePackaging === Product.TYPEPACKAGING_EACH.id;
    };
    this.isTypePackagingMultiple = function() {
        return this.typePackaging === Product.TYPEPACKAGING_PACK_HOMO.id
            || this.typePackaging === Product.TYPEPACKAGING_PACK_HETERO.id
            || this.typePackaging === Product.TYPEPACKAGING_CASE_HOMO.id
            || this.typePackaging === Product.TYPEPACKAGING_CASE_HETERO.id
            || this.typePackaging === Product.TYPEPACKAGING_PALLET_HOMO.id
            || this.typePackaging === Product.TYPEPACKAGING_PALLET_HETERO.id;
    };
    this.isTypePromotionalPromotional = function() {
        return this.typePromotional === Product.TYPEPROMOTIONAL_BONUSPACK.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_FREECOMPONENTS.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_MULTIPACK.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_COMBINATIONPACK.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_SAMPLE.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_FREEGIFTATTACHED.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_SPECIALPACKAGING.id
            || this.typePromotional === Product.TYPEPROMOTIONAL_SPECIALPRICE.id;
    };
};
Product.CERTIFICATION_STATUS_DEFAULT        = new Constant(0, "DEFAULT",       "The Product has not been considered for review yet");
Product.CERTIFICATION_STATUS_REVIEWING      = new Constant(4, "REVIEWING",     "The Product is being reviewed by us before being attributed.")
Product.CERTIFICATION_STATUS_ATTRIBUTED     = new Constant(5, "ATTRIBUTED",    "The Product was attributed to its producer.")
Product.CERTIFICATION_STATUS_ACCEPTED       = new Constant(1, "ACCEPTED",      "The Product was accepted by its producer.");
Product.CERTIFICATION_STATUS_CERTIFIED      = new Constant(2, "CERTIFIED",     "The Product was certified by its producer.");
Product.CERTIFICATION_STATUS_PUBLISHED      = new Constant(3, "PUBLISHED",     "The Product was published by its producer.");

Product.STATUS_VALIDATED                    = new Constant(0, "VALIDATED",     "A Product that has been reviewed by an administrator.");
Product.STATUS_REVIEWED                     = new Constant(1, "REVIEWED",      "A Product that has been reviewed by its brand.");
Product.STATUS_TO_VALIDATE                  = new Constant(2, "TO_VALIDATE",   "A Product that requires validation.");
Product.STATUS_TO_MERGE                     = new Constant(3, "TO_MERGE",      "A Product that needs to be merged.");
Product.STATUS_TO_REVIEW                    = new Constant(4, "TO_REVIEW",     "A Product that needs to be reviewed.");

Product.TYPEPROMOTIONAL_DEFAULT             = new Constant(0, "DEFAULT",         "ne bénéficie pas d'une offre promotionnelle");
Product.TYPEPROMOTIONAL_BONUSPACK           = new Constant(1, "BONUSPACK",       "bénéficie d'une quantité gratuite en plus : \"plus ... gratuit\"");
Product.TYPEPROMOTIONAL_FREECOMPONENTS      = new Constant(2, "FREECOMPONENTS",  "bénéficie d'une quantité gratuite incluse : \"dont ... gratuit\"");
Product.TYPEPROMOTIONAL_MULTIPACK           = new Constant(4, "MULTIPACK",       "est un lot promotionel homogène");
Product.TYPEPROMOTIONAL_COMBINATIONPACK     = new Constant(5, "COMBINATIONPACK", "est un lot promotionel hétérogène");
Product.TYPEPROMOTIONAL_SAMPLE              = new Constant(6, "SAMPLE",          "est accompagné d'un échantillon gratuit qui ne peut pas être vendu séparément au consommateur");
Product.TYPEPROMOTIONAL_FREEGIFTATTACHED    = new Constant(7, "FREEGIFTATTACHED","est accompagné d'un objet gratuit qui ne peut pas être vendu séparément au consommateur");
Product.TYPEPROMOTIONAL_SPECIALPACKAGING    = new Constant(8, "SPECIALPACKAGING","est vendu dans un emballage spécial");
Product.TYPEPROMOTIONAL_SPECIALPRICE        = new Constant(9, "SPECIALPRICE",    "bénéficie d'un prix choc ou d'un offre spéciale qui n'impacte pas le poids du produit");

Product.TYPEPACKAGING_EACH                  = new Constant(0, "EA",              "une unité de base");
Product.TYPEPACKAGING_PACK_HOMO             = new Constant(1, "PK",              "un lot homogène");
Product.TYPEPACKAGING_PACK_HETERO           = new Constant(2, "AP",              "un lot hétérogène");
Product.TYPEPACKAGING_CASE_HOMO             = new Constant(3, "CA",              "un colis homogène");
Product.TYPEPACKAGING_CASE_HETERO           = new Constant(4, "DS",              "un colis hétérogène");
Product.TYPEPACKAGING_PALLET_HOMO           = new Constant(5, "PL",              "une palette homogène");
Product.TYPEPACKAGING_PALLET_HETERO         = new Constant(6, "MX",              "une palette hétérogène");


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

var ProductIsMadeOfProduct = function() {
    this.id = null;
    this.item = null;
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};

var ProductIsComplementaryWithProduct = function() {
    this.id = null;
    this.target = null;
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};

var ProductIsSubstitutableWithProduct = function() {
    this.id = null;
    this.target = null;
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
};


var ProductIsRequiredInRecipe = function() {
    this.id = null;
    this.target = null;
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


