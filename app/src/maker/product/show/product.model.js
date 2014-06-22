
var Constant = function(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
};
var Product = function(){
    this.CERTIFICATION_STATUS_DEFAULT        = new Constant(0, "DEFAULT",       "The Product needs to be accepted and certified.");
    this.CERTIFICATION_STATUS_ACCEPTED       = new Constant(1, "ACCEPTED",      "The Product was accepted by its producer.");
    this.CERTIFICATION_STATUS_CERTIFIED      = new Constant(2, "CERTIFIED",     "The Product was certified by its producer.");
    this.CERTIFICATION_STATUS_PUBLISHED      = new Constant(3, "PUBLISHED",     "The Product was published by its producer.");

    this.STATUS_VALIDATED                    = new Constant(0, "VALIDATED",     "A Product that has been reviewed by an administrator.");
    this.STATUS_REVIEWED                     = new Constant(1, "REVIEWED",      "A Product that has been reviewed by its brand.");
    this.STATUS_TO_VALIDATE                  = new Constant(2, "TO_VALIDATE",   "A Product that requires validation.");
    this.STATUS_TO_MERGE                     = new Constant(3, "TO_MERGE",      "A Product that needs to be merged.");
    this.STATUS_TO_REVIEW                    = new Constant(4, "TO_REVIEW",     "A Product that needs to be reviewed.");

    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        console.log(json['namePublicShort']);
        return this;
    };

    this.isCertified = function() {
        return this.certified === this.CERTIFICATION_STATUS_CERTIFIED.id
            || this.certified === this.CERTIFICATION_STATUS_PUBLISHED.id;
    };
    this.isAccepted = function() {
        return this.certified === this.CERTIFICATION_STATUS_ACCEPTED.id
            || this.certified === this.CERTIFICATION_STATUS_CERTIFIED.id
            || this.certified === this.CERTIFICATION_STATUS_PUBLISHED.id;
    };
};