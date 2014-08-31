'use strict';

var ProductPicture = function(){
    this._type = 'ProductPicture';
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

    // --------------------------------------------------------------------------------
    // Constants
    // --------------------------------------------------------------------------------
    this.contentTypes = function() {
        return [
            ProductPicture.TYPE_OF_CONTENT_UNPACKAGED,
            ProductPicture.TYPE_OF_CONTENT_PACKAGED,
            ProductPicture.TYPE_OF_CONTENT_PREPARED,
            ProductPicture.TYPE_OF_CONTENT_USED
        ];
    };
    this.typeOfInformations = function() {
        return [
            ProductPicture.TYPE_OF_INFORMATION_PACKAGED,
            ProductPicture.TYPE_OF_INFORMATION_UNPACKAGED
        ];
    };
    this.definitions = function() {
        return [
            ProductPicture.TYPE_PICTURE_DEFINITION_STANDARD,
            ProductPicture.TYPE_PICTURE_DEFINITION_HIGH,
            ProductPicture.TYPE_PICTURE_OTHER
        ];
    };
    this.angleVerticals = function() {
        return [
            ProductPicture.ANGLE_VERTICAL_PARALLEL,
            ProductPicture.ANGLE_VERTICAL_PLONGEANTE,
            ProductPicture.ANGLE_VERTICAL_CONTREPLONGEANTE
        ];
    };
    this.angleHorizontals = function() {
        return [
            ProductPicture.ANGLE_HORIZONTAL_LEFT,
            ProductPicture.ANGLE_HORIZONTAL_CENTER,
            ProductPicture.ANGLE_HORIZONTAL_RIGHT
        ];
    };
    this.angleOthers = function() {
        return [
            ProductPicture.ANGLE_OTHER_INTERNAL,
            ProductPicture.ANGLE_OTHER_ZOOM,
            ProductPicture.ANGLE_OTHER_SLICE
        ];
    };
    this.productFaces = function() {
        return [
            ProductPicture.PRODUCT_FACE_DISPLAYED_FRONT,
            ProductPicture.PRODUCT_FACE_DISPLAYED_LEFT_SIDE,
            ProductPicture.PRODUCT_FACE_DISPLAYED_TOP,
            ProductPicture.PRODUCT_FACE_DISPLAYED_BACK,
            ProductPicture.PRODUCT_FACE_DISPLAYED_RIGHT_SIDE,
            ProductPicture.PRODUCT_FACE_DISPLAYED_BOTTOM,
            ProductPicture.PRODUCT_FACE_DISPLAYED_NA
        ];
    };
    this.transparents = function() {
        return [
            ProductPicture.TRANSPARENT,
            ProductPicture.TRANSPARENT_NOT
        ];
    };

    // --------------------------------------------------------------------------------
    // Constant getters
    // --------------------------------------------------------------------------------
    this.contentTypeName = function() {
        var constants = this.contentTypes();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.contentType) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.typeOfInformationName = function() {
        var constants = this.typeOfInformations();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.typeOfInformation) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.definitionName = function() {
        var constants = this.definitions();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.definition) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.angleVerticalName = function() {
        var constants = this.angleVerticals();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.angleVertical) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.angleHorizontalName = function() {
        var constants = this.angleHorizontals();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.angleHorizontal) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.angleOtherName = function() {
        var constants = this.angleOthers();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.angleOther) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.productFaceName = function() {
        var constants = this.productFaces();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.productFace) {
                return constants[i].name;
            }
        }
        return null;
    };
    this.transparentName = function() {
        var constants = this.transparents();
        for (var i = 0; i < constants.length; i ++) {
            if (constants[i].id === this.transparent) {
                return constants[i].name;
            }
        }
        return null;
    };

};

// Type of content
ProductPicture.TYPE_OF_CONTENT_UNPACKAGED = new Constant(0, "Produit nu / déballé - 0");
ProductPicture.TYPE_OF_CONTENT_PACKAGED = new Constant(1, "Produit emballé / Packshot - 1");
ProductPicture.TYPE_OF_CONTENT_PREPARED = new Constant(2, "Préparé - D");
ProductPicture.TYPE_OF_CONTENT_USED = new Constant(3,  "Mise en situation - G");

// Type of information
ProductPicture.TYPE_OF_INFORMATION_PACKAGED = new Constant(0,  "PRODUCT_IMAGE",        "Image du produit emballé");
ProductPicture.TYPE_OF_INFORMATION_UNPACKAGED = new Constant(1,  "OUT_OF_PACKAGE_IMAGE",       "Image du produit déballé");

// File Type
ProductPicture.TYPE_PICTURE_DEFINITION_STANDARD = new Constant(0, "A", "Photographie d’un produit (1 GTIN) en définition standard;");
ProductPicture.TYPE_PICTURE_DEFINITION_HIGH = new Constant(1, "D", "Photographie d’un produit (1 GTIN) en haute définition");
ProductPicture.TYPE_PICTURE_OTHER = new Constant(2, "Z", "Autre (ex. : dessin / illustration, logotype, pictogramme).");

// Angle vertical
ProductPicture.ANGLE_VERTICAL_PARALLEL = new Constant(0, "Parallèle au sol", "ANGLE_VERTICAL_PARALLEL");
ProductPicture.ANGLE_VERTICAL_PLONGEANTE = new Constant(1, "Vue plongeante", "ANGLE_VERTICAL_PLONGEANTE");
ProductPicture.ANGLE_VERTICAL_CONTREPLONGEANTE = new Constant(2, "Vue en contre-plongée", "ANGLE_VERTICAL_CONTREPLONGEANTE");

// Angle horizontal
ProductPicture.ANGLE_HORIZONTAL_LEFT = new Constant(0, "¾ gauche", "L");
ProductPicture.ANGLE_HORIZONTAL_CENTER = new Constant(1, "Centre", "C");
ProductPicture.ANGLE_HORIZONTAL_RIGHT = new Constant(2, "¾ droit", "R");

// Angle other
ProductPicture.ANGLE_OTHER_INTERNAL = new Constant(0, "Vue interne", "ANGLE_OTHER_INTERNAL");
ProductPicture.ANGLE_OTHER_ZOOM = new Constant(1, "Zoom / Détail", "ANGLE_OTHER_ZOOM");
ProductPicture.ANGLE_OTHER_SLICE = new Constant(2, "Vue en coupe", "ANGLE_OTHER_SLICE");

// Face displayed
ProductPicture.PRODUCT_FACE_DISPLAYED_FRONT = new Constant(0, "Face", "1");
ProductPicture.PRODUCT_FACE_DISPLAYED_LEFT_SIDE = new Constant(1, "Côté gauche", "2");
ProductPicture.PRODUCT_FACE_DISPLAYED_TOP = new Constant(2, "Dessus", "3");
ProductPicture.PRODUCT_FACE_DISPLAYED_BACK = new Constant(3, "Dos", "7");
ProductPicture.PRODUCT_FACE_DISPLAYED_RIGHT_SIDE = new Constant(4, "Côté droit", "8");
ProductPicture.PRODUCT_FACE_DISPLAYED_BOTTOM = new Constant(5, "Dessous", "9");
ProductPicture.PRODUCT_FACE_DISPLAYED_NA = new Constant(6, "Non applicable", "0");

// Transparency
ProductPicture.TRANSPARENT = new Constant(0, "Transparent");
ProductPicture.TRANSPARENT_NOT = new Constant(1, "Non Transparent");


