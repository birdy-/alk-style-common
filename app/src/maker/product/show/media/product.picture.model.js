'use strict';

var Constant = function(id, name, description){
    this.id = id;
    this.name = name;
    this.description = description;
};

var ProductPicture = function(){};

// Type of content
ProductPicture.TYPE_OF_CONTENT_UNPACKAGED = new Constant(0, "Produit nu / déballé - 0")
ProductPicture.TYPE_OF_CONTENT_PACKAGED = new Constant(1, "Produit emballé / Packshot - 1")
ProductPicture.TYPE_OF_CONTENT_PREPARED = new Constant(2, "Préparé - D")
ProductPicture.TYPE_OF_CONTENT_USED = new Constant(3,  "Mise en situation - G")

// Type of information
ProductPicture.TYPE_OF_INFORMATION_PACKAGED        = new Constant(0,  "PRODUCT_IMAGE",        "Image du produit emballé")
ProductPicture.TYPE_OF_INFORMATION_UNPACKAGED      = new Constant(1,  "OUT_OF_PACKAGE_IMAGE",       "Image du produit déballé")    

// File Type
ProductPicture.TYPE_PICTURE_DEFINITION_STANDARD = new Constant(0, "A", "Photographie d’un produit (1 GTIN) en définition standard;")
ProductPicture.TYPE_PICTURE_DEFINITION_HIGH = new Constant(1, "D", "Photographie d’un produit (1 GTIN) en haute définition")
ProductPicture.TYPE_PICTURE_OTHER = new Constant(2, "Z", "Autre (ex. : dessin / illustration, logotype, pictogramme).")

// Angle vertical
ProductPicture.ANGLE_VERTICAL_PARALLEL = new Constant(0, "Parallèle au sol", "ANGLE_VERTICAL_PARALLEL")
ProductPicture.ANGLE_VERTICAL_PLONGEANTE = new Constant(1, "Vue plongeante", "ANGLE_VERTICAL_PLONGEANTE")
ProductPicture.ANGLE_VERTICAL_CONTREPLONGEANTE = new Constant(2, "Vue en contre-plongée", "ANGLE_VERTICAL_CONTREPLONGEANTE")

// Angle horizontal
ProductPicture.ANGLE_HORIZONTAL_LEFT = new Constant(0, "¾ gauche", "L")
ProductPicture.ANGLE_HORIZONTAL_CENTER = new Constant(1, "Centre", "C")
ProductPicture.ANGLE_HORIZONTAL_RIGHT = new Constant(2, "¾ droit", "R")

// Angle other
ProductPicture.ANGLE_OTHER_INTERNAL = new Constant(0, "Vue interne", "ANGLE_OTHER_INTERNAL")
ProductPicture.ANGLE_OTHER_ZOOM = new Constant(1, "Zoom / Détail", "ANGLE_OTHER_ZOOM")
ProductPicture.ANGLE_OTHER_SLICE = new Constant(2, "Vue en coupe", "ANGLE_OTHER_SLICE")

// Face displayed
ProductPicture.PRODUCT_FACE_DISPLAYED_FRONT = new Constant(0, "Face", "1")
ProductPicture.PRODUCT_FACE_DISPLAYED_LEFT_SIDE = new Constant(1, "Côté gauche", "2")
ProductPicture.PRODUCT_FACE_DISPLAYED_TOP = new Constant(2, "Dessus", "3")
ProductPicture.PRODUCT_FACE_DISPLAYED_BACK = new Constant(3, "Dos", "7")
ProductPicture.PRODUCT_FACE_DISPLAYED_RIGHT_SIDE = new Constant(4, "Côté droit", "8")
ProductPicture.PRODUCT_FACE_DISPLAYED_BOTTOM = new Constant(5, "Dessous", "9")
ProductPicture.PRODUCT_FACE_DISPLAYED_NA = new Constant(6, "Non applicable", "0")

// Transparency
ProductPicture.TRANSPARENT = new Constant(0, "Transparent")
ProductPicture.TRANSPARENT_NOT = new Constant(1, "Non Transparent")


