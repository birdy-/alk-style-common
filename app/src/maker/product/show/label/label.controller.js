'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowLabelController', [
    '$scope', '$$ORM',
    function ($scope, $$ORM) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.labels = {};
    [
        18070, 18262, 18263, 18264, 18265, 18266, 18267, 18268, 18269, 18270, 18271,
        18272, 18419, 18935, 18942, 19003, 19094, 19095, 19096, 19097, 19098, 19099,
        19100, 19101, 19102, 19103, 19104, 19105, 19106, 19107, 19108, 19109, 19110,
        19111, 19112, 19113, 19114, 19121, 19122, 19122, 19123, 19124, 19125, 19126,
        19127, 19128, 19129, 19130, 19131, 19132, 19133, 19134, 19135, 19137, 19138,
        19139, 19140, 19141, 19142, 19143, 19144, 19145, 19146, 19147, 19148, 19149,
        19150, 19151, 19152, 19153, 19154, 19155, 19156, 19157, 19158, 19159, 19160,
        19161, 19162, 19163, 19164, 19165, 19166, 19167, 19168, 19169, 19170, 19171,
        10055, 10064, 10262, 10265, 10321, 10326, 10327, 10328, 10329, 10330, 10331,
        10332, 10333, 10334, 10335, 10336, 10337, 10338, 10339, 10340, 10341, 10342,
        10343, 10344, 10345, 18935, 19114, 10347, 10419, 10431, 10447, 10448, 10449,
        10450
    ].map(function (labelId) {
        $scope.labels[labelId] = $$ORM.repository('Concept').lazy(labelId);
    });

    $scope.labelGroups = [
        {
            title: 'Mentions légales',
            labels: [
                $scope.labels[10447],
                $scope.labels[10448],
                $scope.labels[10449],
                $scope.labels[10450]
            ]
        },
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
                $scope.labels[19110], // label Marine Stewardship Council
                $scope.labels[19111], // label Aquaculture Stewardship Council
                $scope.labels[10419], // label IFFO RS assured
                $scope.labels[10431], // label Sustainable Fisheries Partnership
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
