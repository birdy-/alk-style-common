'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowLabelController', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------

    var labels = [
        { id:18070, name:"Vendanges Tardives"},
        { id:18262, name:"Sélection de grains nobles"},
        { id:18263, name:"Dénomination de cépage"},
        { id:18264, name:"Appellation d'Origine Contrôlée"},
        { id:18265, name:"Indication géographique protégée"},
        { id:18266, name:"Appellation d'Origine Protégée"},
        { id:18267, name:"Vin de pays"},
        { id:18268, name:"Appellation d'Origine Vin délimité de Qualité supérieure"},
        { id:18269, name:"Denominação de Origem Controlada"},
        { id:18270, name:"Denominazione di origine controllata"},
        { id:18271, name:"Denominazione di origine controllata e garantita"},
        { id:18272, name:"Indicazione Geografica Tipica"},
        { id:18419, name:"label manger bouger"},
        { id:18935, name:"Denominazione di origine protetta"},
        { id:18942, name:"Label Rouge"},
        { id:19003, name:"Vin Doux Naturel"},
        { id:19094, name:"Fair Trade"},
        { id:19095, name:"Agriculture Biologique Européenne"},
        { id:19096, name:"Agriculture Biologique Française"},
        { id:19097, name:"Eko"},
        { id:19098, name:"Bio-Équitable"},
        { id:19099, name:"Bio-Garantie"},
        { id:19100, name:"Montagnes Françaises"},
        { id:19101, name:"Demeter"},
        { id:19102, name:"Nature et Progrès"},
        { id:19103, name:"Bio-Cohérence"},
        { id:19104, name:"Origine Française Garantie"},
        { id:19105, name:"Viande de Porc Français"},
        { id:19106, name:"Viande de Bœuf Français"},
        { id:19107, name:"Bleu Blanc Cœur"},
        { id:19108, name:"Charte du Progrès Nutritionel (manger bouger)"},
        { id:19109, name:"Spécialité Traditionnelle Garantie"},
        { id:19110, name:"Marine Stewardship Council"},
        { id:19111, name:"Aquaculture Stewardship Council"},
        { id:19112, name:"Rainforest Alliance"},
        { id:19113, name:"Saveur en Or"},
        { id:19114, name:"Eco-Label"},
        { id:19121, name:"Max Havelaar"},
        { id:19122, name:"Produit Certifié"},
        { id:19122, name: "Label Produit Certifié"},
        { id:19123, name: "Marquage CE"},
        { id:19124, name: "Marquage métrologique"},
        { id:19125, name: "Label éco-emballage"},
        { id:19126, name: "Label Saveur de l'année"},
        { id:19127, name: "Label papier recyclé"},
        { id:19128, name: "Label Blauer Engel"},
        { id:19129, name: "Label Forest Stewardship Council"},
        { id:19130, name: "Symbole recyclable"},
        { id:19131, name: "Emballage en acier recyclable"},
        { id:19132, name: "Label Energy Star"},
        { id:19133, name: "Logo femme enceinte"},
        { id:19134, name: "Label RADURA"},
        { id:19135, name: "Emballage en aluminium recyclable"},
        { id:19137, name: "Emballage en carton ondulé recyclable"},
        { id:19138, name: "Emballage en carton ondulé recyclé"},
        { id:19139, name: "Label RESY"},
        { id:19140, name: "Emballage en Polyéthylène Teraphtalate"},
        { id:19141, name: "Emballage en Polyéthylène haute densité"},
        { id:19142, name: "Emballage en Polychlorure de Vinyle"},
        { id:19143, name: "Emballage en Polyéthylène basse densité"},
        { id:19144, name: "Emballage en Polypropylène"},
        { id:19145, name: "Emballage en Polystyrène Expansé"},
        { id:19146, name: "Produit exonéré d'écotaxe"},
        { id:19147, name: "Emballage consigné"},
        { id:19148, name: "Emballage à jeter à la poubelle"},
        { id:19149, name: "Label protège la couche d'ozone"},
        { id:19150, name: "Label pour le contact alimentaire"},
        { id:19151, name: "Label veau fermier élevé sous sa mère"},
        { id:19152, name: "Label 1% pour la planète"},
        { id:19153, name: "Label Agri-Confiance"},
        { id:19154, name: "Label aquaculture de nos régions"},
        { id:19155, name: "Label Ecocert"},
        { id:19156, name: "Label Main dans la Main"},
        { id:19157, name: "Label Naturland"},
        { id:19158, name: "Label Pavillon France"},
        { id:19159, name: "Label Roundtable on Sustanaible Palm Oil"},
        { id:19160, name: "Label Soil Association"},
        { id:19161, name: "Label Vignerons en Développement Durable"},
        { id:19162, name: "Label Ensemble pour plus de sens"},
        { id:19163, name: "Label Fair Flower Fair Plants"},
        { id:19164, name: "Label STEP"},
        { id:19165, name: "Label MINGA"},
        { id:19166, name: "Label Produit de l'année"},
        { id:19167, name: "Label Equitable Solidaire Responsable"},
        { id:19168, name: "Label NF Environnement"},
        { id:19169, name: "Label Atout Certifié Qualité"},
        { id:19170, name: "Label Critères Qualité Certifiés"},
        { id:19171, name: "Label USDA Organic"},
        { id: 10055, name: "Label Cosmétique Bio" },

        { id: 10064, name: "Label Vegan" },
        { id: 10262, name: "logo Alcool j'achète pas à moins de 18 ans" },
        { id: 10265, name: "Label Approuvé par les médecins allergologues de l'ARCAA" },
        { id: 10321, name: "Label Blason Prestige" },
        { id: 10326, name: "Label Agneau St George" },
        { id: 10327, name: "Charte des bonnes pratiques d'élevage" },
        { id: 10328, name: "Label Fleur de Limousine" },
        { id: 10329, name: "Label Filière Qualité Carrefour" },
        { id: 10330, name: "Label Gourmet Naturel" },
        { id: 10331, name: "Label Bœuf de Charolles" },
        { id: 10332, name: "Label Sans Gluten ADFDIAG" },
        { id: 10333, name: "Label Éleveurs de Champagne-Ardennes" },
        { id: 10334, name: "Label Bovillage" },
        { id: 10335, name: "Label Bœuf fermier de l'Aubrac" },
        { id: 10336, name: "Label Charoluxe" },
        { id: 10337, name: "Label race à viande" },
        { id: 10338, name: "Label Saveur Occitane" },
        { id: 10339, name: "Label Terroir Charolais" },
        { id: 10340, name: "Label Qualivet Filière Non OGM" },
        { id: 10341, name: "Label Qualité Limousine" },
        { id: 10342, name: "Concours Général Agricole Or" },
        { id: 10343, name: "Concours Général Agricole Argent" },
        { id: 10344, name: "Concours Général Agricole Bronze" },
        { id: 10345, name: "Sélection Guide Hachette" },
        { id: 18935, name: "Dénomination d'Origine Protégée" },
        { id: 19114, name: "Label Eco-Label" },
        { id: 10347, name: "Œuf pondu en France" }
    ];
    $scope.labels = {};
    labels.map(function(label) {
        $scope.labels[label.id] = label;
    });

    $scope.labelGroups = [
        {
            title: 'Agriculture biologique',
            labels: [
                $scope.labels[19096],
                $scope.labels[19095],
                $scope.labels[19098],
                $scope.labels[19099],
                $scope.labels[19103],
                $scope.labels[19171]
            ]
        },
        {
            title: 'Qualité / récompenses',
            labels: [
                $scope.labels[19126],
                $scope.labels[19166],
                $scope.labels[19169],
                $scope.labels[19170],
                $scope.labels[19108]
            ]
        },
        {
            title: 'Distinctions',
            labels: [
                $scope.labels[10342], // Concours Général Agricole Or
                $scope.labels[10343], // Concours Général Agricole Argent
                $scope.labels[10344], // Concours Général Agricole Bronze
                $scope.labels[10345] // Sélection Guide Hachette
            ]
        },
        {
            title: 'Utilisation',
            labels: [
                $scope.labels[19133],
                $scope.labels[19150],
                $scope.labels[10262] // logo Alcool j'achète pas à moins de 18 ans
            ]
        },
        {
            title: 'Régimes particuliers',
            labels: [
                $scope.labels[10064], // label Vegan
                $scope.labels[10332] // label Sans Gluten ADFDIAG
            ]
        },
        {
            title: 'Allergènes',
            labels: [
                $scope.labels[10265] // label Approuvé par les médecins allergologues del'ARCAA
            ]
        },
        {
            title: 'Production équitable',
            labels: [
                $scope.labels[19094],
                $scope.labels[19097],
                $scope.labels[19101],
                $scope.labels[19121]
            ]
        },
        {
            title: 'Développement durable',
            labels: [
                $scope.labels[19114], // label Eco-Label
                $scope.labels[19102],
                $scope.labels[19107],
                $scope.labels[19110],
                $scope.labels[19122],
                $scope.labels[19112],
                $scope.labels[19134],
                $scope.labels[19149],
                $scope.labels[19152],
                $scope.labels[19153],
                $scope.labels[19155],
                $scope.labels[19156],
                $scope.labels[19157],
                $scope.labels[19159],
                $scope.labels[19160],
                $scope.labels[19161],
                $scope.labels[19162],
                $scope.labels[19163],
                $scope.labels[19164],
                $scope.labels[19165],
                $scope.labels[19167],
                $scope.labels[19168],
                $scope.labels[19129]
            ]
        },
        {
            title: 'Provenance',
            labels: [
                $scope.labels[19100],
                $scope.labels[18266],
                $scope.labels[18264],
                $scope.labels[18265], // Indication géographique protégée
                $scope.labels[18935], // Dénomination d'Origine Protégée
                $scope.labels[19109], // label Spécialité Traditionnelle Garantie
                $scope.labels[19104],
                $scope.labels[18942],
                $scope.labels[19122],
                $scope.labels[19128],
                $scope.labels[10347] //Œuf pondu en France
            ]
        },
        {
            title: 'Viande et poissons',
            labels: [
                $scope.labels[19105],
                $scope.labels[19106],
                $scope.labels[19151],
                $scope.labels[10321], // label Blason Prestige
                $scope.labels[10326], // label Agneau St George
                $scope.labels[10327], // charte des bonnes pratiques d'élevage
                $scope.labels[10328], // label Fleur de Limousine
                $scope.labels[10329], // label Filière Qualité Carrefour
                $scope.labels[10331], // label Bœuf de Charolles
                $scope.labels[10333], // label Éleveurs de Champagne-Ardennes
                $scope.labels[10334], // label Bovillage
                $scope.labels[10335], // label Bœuf fermier de l'Aubrac
                $scope.labels[10336], // label Charoluxe
                $scope.labels[10337], // label race à viande
                $scope.labels[10338], // label Saveur Occitane
                $scope.labels[10339], // label Terroir Charolais
                $scope.labels[10340], // label Qualivet Filière Non OGM
                $scope.labels[10341], // label Qualité Limousine
                $scope.labels[19111],
                $scope.labels[19154],
                $scope.labels[19158],
                $scope.labels[10330] // label Gourmet Naturel
            ]
        },
        {
            title: 'Emballage / recyclage',
            labels: [
                $scope.labels[19123],
                $scope.labels[19124],
                $scope.labels[19125],
                $scope.labels[19127],
                $scope.labels[19130],
                $scope.labels[19131],
                $scope.labels[19132],
                $scope.labels[19135],
                $scope.labels[19137],
                $scope.labels[19138],
                $scope.labels[19139],
                $scope.labels[19140],
                $scope.labels[19141],
                $scope.labels[19142],
                $scope.labels[19143],
                $scope.labels[19144],
                $scope.labels[19145],
                $scope.labels[19146],
                $scope.labels[19147],
                $scope.labels[19148]
            ]
        }
    ];
}]);
