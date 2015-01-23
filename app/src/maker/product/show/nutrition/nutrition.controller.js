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
    $scope.nutritionLoading = true;

    $scope.pnqs = {};
    [
        19195, 19196, 19058, 19059, 19060, 19061, 19062, 19063, 19064, 19065,
        19066, 19067, 19068, 19069, 19070, 19071, 19072, 19073, 19074, 18978,
        18739, 18740, 18741, 18744, 18983, 18743, 18742, 18985, 18982, 18979,
        18980, 18981, 19075, 19076, 19077, 18989, 18988, 18998, 19078, 18994,
        18992, 18996, 19000, 18991, 18999, 19079, 18990, 19080, 18987, 19081,
        19082, 19083, 18997, 19084, 18993, 18995 // duplicates , 18986, 18984
    ].map(function (id) {
        return $$ORM.repository('Concept').lazy(id);
    }).map(function (concept) {
        $scope.pnqs[concept.id] = {
            isConceptualizedBy: concept,
            isMeasuredBy: concept.isMeasuredBy,
            type: concept.type,
            pnqs: {}
        };
    });

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.addPSQ = function () {
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
    $scope.deletePSQ = function (psq) {
        $$sdkCrud.ProductStandardQuantityDelete(psq).success(function (response){
            detachProductNutritionalQuantityFromProductStandardQuantity(psq);
            delete $scope.psqs[psq.id];
        }).error(function (response){
            $window.alert('Erreur pendant la suppression de la quantité standard');
        });
    };
    $scope.savePSQ = function (psq) {
        var pnq;
        for (var conceptId in $scope.pnqs) {
            pnq = $scope.pnqs[conceptId].pnqs[psq.id];
            if (!pnq) {
                throw 'Missing ProductNutritionalQuantity for ProductStandardQuantity ' + pnq.id + ' and Concept ' + conceptId;
            }
            if ((typeof(pnq.quantity) === 'undefined' || pnq.quantity === null || pnq.quantity === '')
            && (typeof(pnq.percentageOfDailyValueIntake) === 'undefined' || pnq.percentageOfDailyValueIntake === null || pnq.percentageOfDailyValueIntake === '')) {
                if (psq.contains.indexOf(pnq) !== -1)
                    psq.contains.splice(psq.contains.indexOf(pnq), 1);
                continue;
            }
            if (psq.contains.indexOf(pnq) !== -1) {
                continue;
            }
            $log.log('Nutrition Controller : Pushed new ProductNutritionalQuantity');
            psq.contains.push(pnq);
        }
        $$sdkCrud.ProductStandardQuantityUpdate(psq).success(function (response){
        }).error(function (response){
            $window.alert('Erreur pendant la mise à jour de la quantité standard');
        });
    };
    $scope.len = function () {
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
    var detachProductNutritionalQuantityFromProductStandardQuantity = function (psq) {
        var legend;
        for (var conceptId in $scope.pnqs) {
            legend = $scope.pnqs[conceptId];
            delete legend.pnqs[psq.id];
        }
    };
    var attachProductNutritionalQuantityToProductStandardQuantity = function (psq) {
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

    var psqsLoaderWatcher =  $scope.$watch('product', function () {
        if (!$scope.product
        || !$scope.product.id) {
            return;
        }
        $$sdkCrud.ProductStandardQuantityList({}, {'partitions_id': $scope.product.id}).success(function (response) {
            $scope.nutritionLoading = false;

            if (response.data.length === 0) {
                $scope.addPSQ();
            }
            var psq;
            for (var i = 0; i < response.data.length; i++) {
                psq = new ProductStandardQuantity().fromJson(response.data[i]);
                attachProductNutritionalQuantityToProductStandardQuantity(psq);
                $scope.psqs[psq.id] = psq;
            }
            psqsLoaderWatcher(); // Stop the watcher
        }).error(function (error) {
            $scope.nutritionLoading = false;
            psqsLoaderWatcher(); // Stop the watcher
            $window.alert('Erreur pendant le chargement des données (contactez notre support si le problème persiste) : ' + error);
        });
    }, true);

    $scope.$on('PRODUCT_SAVING', function () {
        for (var psqId in $scope.psqs) {
            $scope.savePSQ($scope.psqs[psqId]);
        }
    });
}]);
