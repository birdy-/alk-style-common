'use strict';

var Notification = function(){
    this.ICONS = {
        0: '',
        10: 'info',
        20: 'check',
        30: 'warning',
        40: 'warning', //'error',
        50: 'critical',
    };
    this.LEVELS = {
        0: '',
        10: 'info',
        20: 'success',
        30: 'warning',
        40: 'danger', //'error',
        50: 'critical',
    };
    this.SUBJECTS = {
        1: "Rapport d'erreur",
        2: "Nouveau champ disponible",
        0: "Produit crée",
        3: "Produit modifé",
        7: "Produit accepté",
        6: "Produit certifié",
        4: "Import réussi",
        5: "Nouveau produit attribué",
    };
    this.fromJson = function(json) {
        this.id = json['id'];
        this.level = json['level'];
        this.message = json['message'];
        this.from = json['from'];
        this.subject = json['subject'];
        this.about = json['about'];
        this.read = json['read'];
        this.field = json['field'];
        this.createdAt = json['createdAt'];
        return this;
    };
    this.levelName = function(){
        return this.LEVELS[this.level];
    };
    this.iconName = function() {
        return this.ICONS[this.level];
    };
    this.subjectName = function() {
        return this.SUBJECTS[this.subject];
    };
    this.read = function(){
        this.read = true;
    };
};