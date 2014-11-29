'use strict';

var UserClaimProductReference = function () {
    this._type = 'UserClaimProductReference';

    this.id = null;
    this.productName = null;
    this.productReference = null;

    this.createdAt = null;
    this.updatedAt = null;
    this.timestamp = null;
    this.type = null;


    this.typeName = function () {
        var types = this.types();
        for (var i = 0; i < types.length; i++) {
            if (types[i].id === this.type) {
                return types[i].name;
            }
        }
        return '';
    };
    this.types = function () {
        return [
            UserClaimProductReference.TYPE_CREATED,
            UserClaimProductReference.TYPE_ACCEPTED,
            UserClaimProductReference.TYPE_REFUSED,
            UserClaimProductReference.TYPE_ERRORED
        ];
    };
    this.fromJson = function (json) {
        for (var key in json) {
            this[key] = json[key];
        }

        this.productName = json['product_name'];
        this.productReference = json['reference'];

        this.createdAt = moment(json['createdAt']).unix();
        this.updatedAt = moment(json['updatedAt']).unix();
        this.timestamp = this.updatedAt;
        this.type = this.types()[json['status']].name
        return this;
    };
};
UserClaimProductReference._type = 'UserClaimProductReference';
UserClaimProductReference.TYPE_CREATED = new Constant(0, 'ProductClaimCreated', 'Demande de produit reçue');
UserClaimProductReference.TYPE_ACCEPTED = new Constant(1, 'ProductClaimAccepted', 'Demande de produit acceptée');
UserClaimProductReference.TYPE_REFUSED = new Constant(2, 'ProductClaimRefused', 'Demande de produit refusée');
UserClaimProductReference.TYPE_ERRORED = new Constant(3, 'ProductClaimErrored', 'Erreur lors de la demande du produit');
