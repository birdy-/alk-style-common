'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowNutritionController', [
    '$scope', '$$sdkCrud', '$modal', '$log', '$$ORM', '$window',
    function ($scope, $$sdkCrud, $modal, $log, $$ORM, $window) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.psqs = {};
    $scope.showVitamins = false;
    $scope.showMinerals = false;
    $scope.showNutrition = false;

    var $$CommonUnitRepository = $$ORM.repository('CommonUnit');
    $$CommonUnitRepository.lazy(3).fromJson({id: 3, name: 'gramme'});
    $$CommonUnitRepository.lazy(104).fromJson({id: 104, name: 'kilo joule'});
    $$CommonUnitRepository.lazy(106).fromJson({id: 106, name: 'kilo calorie'});

    var pnqs = [
        { name: 'Valeur énergétique (kJ)',  id: 19195, isMeasuredBy_id: 104, type: 'Nutrition', compulsory: true,  legend: "" },
        { name: 'Valeur énergétique (kCal)',id: 19196, isMeasuredBy_id: 106, type: 'Nutrition', compulsory: true,  legend: "" },
        { name: 'Matières grasses',         id: 19058, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de lipides (y compris phospholipides), rapportée 100 grammes de produit." },
        { name: 'Acides gras saturatés',    id: 19059, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La quantité totale d'acides gras sans double liaison, rapportée à 100 grammes de produit." },
        { name: 'Acides gras monoinsaturés',id: 19060, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec une double liaison cis, rapportée à 100 grammes de produit." },
        { name: 'Acides gras polyinsaturés',id: 19061, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec deux (ou plus) doubles liaisons interrompues cis ou cis-méthylène, rapportée à 100 grammes de produit." },
        { name: 'Acides gras trans',        id: 19062, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "" },
        { name: 'Cholestérol',              id: 19063, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "" },
        { name: 'Oméga 3',                  id: 19064, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "" },
        { name: 'Oméga 6',                  id: 19065, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: ""  },
        { name: 'Rapport gras',             id: 19066, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: ""  },
        { name: 'Glucides',                 id: 19067, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les glucides métabolisés par l’homme, y compris les polyols, rapportée à 100 grammes de produit." },
        { name: 'Sucres',                   id: 19068, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les monosaccharides et disaccharides présents dans une denrée alimentaire, à l’exclusion des polyols, rapportée à 100 grammes de produit." },
        { name: 'Polyols',                  id: 19069, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "La quantité totale de tous les alcools comprenant plus de deux groupes hydroxyles, rapportée à 100 grammes de produit." },
        { name: 'Amidon',                   id: 19070, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "" },
        { name: 'Fibres alimentaires',      id: 19071, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de fibres alimentaires, rapportée à 100 grammes de produit. Il s'agit des polymères glucidiques composés de trois unités monomériques ou plus, qui ne sont ni digérés ni absorbés dans l’intestin grêle humain et appartiennent à l’une des catégories suivantes: - polymères glucidiques comestibles, présents naturellement dans la denrée alimentaire telle qu’elle est consommée, - polymères glucidiques comestibles qui ont été obtenus à partir de matières premières alimentaires brutes par des moyens physiques, enzymatiques ou chimiques et ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises, - polymères glucidiques comestibles synthétiques qui ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises." },
        { name: 'Protéines',                id: 19072, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La teneur en protéines, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>protéines = azote total (Kjeldahl) &times; 6,25</code>" },
        { name: 'Sel',                      id: 19073, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: true,  legend: "La teneur en équivalent en sel, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>sel = sodium &times; 2,5</code>." },
        { name: 'Eau',                      id: 19074, isMeasuredBy_id:   3, type: 'Nutrition', compulsory: false, legend: "" },

        { name: 'Vitamine A',               id: 18978, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B1',              id: 18739, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B2',              id: 18740, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B3',              id: 18741, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B5',              id: 18744, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B6',              id: 18983, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B8',              id: 18743, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B9',              id: 18742, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B11',             id: 18984, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine B12',             id: 18985, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine C',               id: 18982, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine D',               id: 18979, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine E',               id: 18980, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine K',               id: 18981, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },
        { name: 'Vitamine H',               id: 18986, isMeasuredBy_id:   3, type: 'Vitamin',   compulsory: false, legend: "" },

        { name: 'Aluminium',                id: 19075, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Arsenic',                  id: 19076, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Bore',                     id: 19077, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Calcium',                  id: 18989, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Chlore',                   id: 18988, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Chrome',                   id: 18998, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Cobalt',                   id: 19078, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Cuivre',                   id: 18994, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Fer',                      id: 18992, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Fluor',                    id: 18996, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Iode',                     id: 19000, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Magnésium',                id: 18991, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Molybdène',                id: 18999, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Nickel',                   id: 19079, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Phosphore',                id: 18990, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Plomb',                    id: 19080, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Potassium',                id: 18987, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Sodium',                   id: 19081, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Souffre',                  id: 19082, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Silicium',                 id: 19083, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Sélénium',                 id: 18997, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Vanadium',                 id: 19084, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" },
        { name: 'Zinc',                     id: 18993, isMeasuredBy_id:   3, type: 'Mineral',   compulsory: false, legend: "" }
    ];

    $scope.pnqs = {};
    pnqs.map(function(pnq) {
        $scope.pnqs[pnq.id] = {
            isConceptualizedBy: {
                id: pnq.id,
                name: pnq.name,
                compulsory: pnq.compulsory
            },
            isMeasuredBy: $$CommonUnitRepository.lazy(pnq.isMeasuredBy_id),
            type: pnq.type,
            pnqs: {}
        };
    });

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.addPSQ = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/show/nutrition/productstandardquantity.html',
            controller: 'ProductStandardQuantityModalController',
            resolve: {
                productStandardQuantity: function () {
                    return new ProductStandardQuantity().fromJson({
                        partitions: {
                            id: $scope.product.id
                        },
                        preparationState: ProductStandardQuantity.PREPARATIONSTATE_UNPREPARED.id
                    });
                }
            }
        });

        modalInstance.result.then(function (psq) {
            $scope.psqs[psq.id] = psq;
            attachProductNutritionalQuantityToProductStandardQuantity(psq);
        }, function () {
        });
    };
    $scope.deletePSQ = function(psq) {
        $$sdkCrud.ProductStandardQuantityDelete(psq).success(function(response){
            detachProductNutritionalQuantityFromProductStandardQuantity(psq);
            delete $scope.psqs[psq.id];
        }).error(function(response){
            $window.alert('Erreur pendant la suppression de la quantité standard');
        });
    };
    $scope.savePSQ = function(psq) {
        var pnq;
        for (var conceptId in $scope.pnqs) {
            pnq = $scope.pnqs[conceptId].pnqs[psq.id];
            if (!pnq) {
                throw 'Missing ProductNutritionalQuantity for ProductStandardQuantity '+pnq.id+' and Concept '+conceptId;
            }
            if ((typeof(pnq.quantity) === 'undefined' || pnq.quantity === null)
            && (typeof(pnq.percentageOfDailyValueIntake) === 'undefined' || pnq.percentageOfDailyValueIntake === null)) {
                continue;
            }
            if (psq.contains.indexOf(pnq) !== -1) {
                continue;
            }
            $log.log('Nutrition Controller : Pushed new ProductNutritionalQuantity');
            psq.contains.push(pnq);
        }
        $$sdkCrud.ProductStandardQuantityUpdate(psq).success(function(response){
        }).error(function(response){
            $window.alert('Erreur pendant la mise à jour de la quantité standard');
        });
    };
    $scope.len = function() {
        return Object.keys($scope.psqs);
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    /**
     * Fills up the $scope.pnqs objects with ProductNutritionalQuantity :
     * - find them
     * - creates them if they don't
     */
    var detachProductNutritionalQuantityFromProductStandardQuantity = function(psq) {
        var legend;
        for (var conceptId in $scope.pnqs) {
            legend = $scope.pnqs[conceptId];
            delete legend.pnqs[psq.id];
        }
    };
    var attachProductNutritionalQuantityToProductStandardQuantity = function(psq) {
        var pnq, legend;
        for (var conceptId in $scope.pnqs) {
            legend = $scope.pnqs[conceptId];
            pnq = psq.getContainsById(conceptId);
            if (pnq === null) {
                pnq = new ProductNutritionalQuantity();
                pnq.measurementPrecision = ProductNutritionalQuantity.MEASUREMENTPRECISION_EXACT.id;
                pnq.isMeasuredBy = legend.isMeasuredBy;
                pnq.isConceptualizedBy = legend.isConceptualizedBy;
                // psq.push(pnq); Will be done when the user saves the object
            } else {
                switch (legend.type) {
                    case 'Vitamin':
                        $scope.showVitamins = true;
                        break;
                    case 'Mineral':
                        $scope.showMinerals = true;
                        break;
                    case 'Nutrition':
                        $scope.showNutrition = true;
                        break;
                }
            }
            legend.pnqs[psq.id] = pnq;
        }
    };
    $scope.$watch('product', function(){
        if (!$scope.product
        || !$scope.product.id) {
            return;
        }
        $$sdkCrud.ProductStandardQuantityList({}, {'partitions_id': $scope.product.id}).success(function(response){
            if (response.data.length === 0) {
                $scope.addPSQ();
            }
            var psq;
            for (var i = 0; i < response.data.length; i++) {
                psq = new ProductStandardQuantity().fromJson(response.data[i]);
                attachProductNutritionalQuantityToProductStandardQuantity(psq);
                $scope.psqs[psq.id] = psq;
            }
        });
    }, true);
}]);




