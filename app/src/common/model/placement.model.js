'use strict';

var Placement = function() {
    this.fromJson = function(json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Placement';
};

Placement.TYPE_SHOPPING_LIST_RECIPE   = new Constant(1, "Shopping List");
Placement.TYPE_SHOPPING_LIST_LIST     = new Constant(2, "List shopping list interface");
Placement.TYPE_PRINTED_LIST_RECIPE    = new Constant(11, "Recipe printed list interface");
Placement.TYPE_PRINTED_LIST_LIST      = new Constant(12, "List printed list interface");
Placement.TYPE_RECIPE_LINK            = new Constant(3, "Recipe button add-to-basket");
Placement.TYPE_PRODUCT_LINK           = new Constant(4, "Product button add-to-basket");
Placement.TYPE_IN_BANNER              = new Constant(5, "In banner add-to-basket");
Placement.TYPE_IN_VIDEO               = new Constant(6, "In video add-to-basket");
Placement.TYPE_BANNER_SIMPLE          = new Constant(7, "Simple banner add-to-basket");
Placement.TYPE_BANNER_INTERACTIVE     = new Constant(8, "Interactive banner add-to-basket");
Placement.TYPE_API                    = new Constant(9, "API");
