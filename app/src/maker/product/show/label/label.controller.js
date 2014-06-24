'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowLabelCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {data:[], multiple: false, maximumSelectionSize: 1, minimumInputLength:0});

    var labels = [
        { id:18070, name:"Vendanges Tardives"},
        { id:18262, name:"Sélection de grains nobles"},
        { id:18263, name:"Dénomination de cépage"},
        { id:18264, name:"Appellation d'Origine Contrôlée", abbr:"aoc"},
        { id:18265, name:"Indication géographique protégée", abbr:"igp"},
        { id:18266, name:"Appellation d'Origine Protégée", abbr:"aop"},
        { id:18267, name:"Vin de pays"},
        { id:18268, name:"Appellation d'Origine Vin délimité de Qualité supérieure"},
        { id:18269, name:"Denominação de Origem Controlada"},
        { id:18270, name:"Denominazione di origine controllata"},
        { id:18271, name:"Denominazione di origine controllata e garantita"},
        { id:18272, name:"Indicazione Geografica Tipica"},
        { id:18419, name:"label manger bouger"},
        { id:18935, name:"Denominazione di origine protetta"},
        { id:18942, name:"Label Rouge", abbr:"lr"},
        { id:19003, name:"Vin Doux Naturel"},
        { id:19094, name:"Fair Trade", abbr:'ft'},
        { id:19095, name:"Agriculture Biologique Européenne", abbr:'abe'},
        { id:19096, name:"Agriculture Biologique Française", abbr:'abf'},
        { id:19097, name:"Eko", abbr:'eko'},
        { id:19098, name:"Bio-Équitable", abbr:'be'},
        { id:19099, name:"Bio-Garantie", abbr:'bg'},
        { id:19100, name:"Montagnes Françaises", abbr:"mf"},
        { id:19101, name:"Demeter", abbr:'d'},
        { id:19102, name:"Nature et Progrès", abbr:'np'},
        { id:19103, name:"Bio-Cohérence", abbr:'bc'},
        { id:19104, name:"Origine Française Garantie", abbr:"ofg"},
        { id:19105, name:"Viande de Porc Français", abbr:"v2pf"},
        { id:19106, name:"Viande de Bœuf Français", abbr:"v2bf"},
        { id:19107, name:"Bleu Blanc Cœur", abbr:'bbc'},
        { id:19108, name:"Charte du Progrès Nutritionel", abbr:"cpn"},
        { id:19109, name:"Spécialité Traditionnelle Garantie", abbr:"stg"},
        { id:19110, name:"Marine Stewardship Council", abbr:"msc"},
        { id:19111, name:"Aquaculture Stewardship Council", abbr:"ac"},
        { id:19112, name:"Rainforest Alliance", abbr:"rf"},
        { id:19113, name:"Saveur en Or"},
        { id:19114, name:"Eco-Label"},
        { id:19121, name:"Max Havelaar", abbr:"mh"},
        { id:19122, name:"Produit Certifié", abbr:"cp"},
    ];
    $scope.labels = {}
    labels.map(function(label) {
        $scope.labels[label.id] = label;
    });

}]);