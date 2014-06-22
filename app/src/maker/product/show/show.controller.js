'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowNutritionCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.psqs = [];



    var pnqs = [
        { name: 'Valeur énergétique (kJ)',  id: 19056, compulsory: true,  legend: "" },
        { name: 'Valeur énergétique (kCal)',id: 19057, compulsory: true,  legend: "" },
        { name: 'Matières grasses',         id: 19058, compulsory: true,  legend: "La quantité totale de lipides (y compris phospholipides), rapportée 100 grammes de produit." },
        { name: 'Acides gras saturatés',    id: 19059, compulsory: true,  legend: "La quantité totale d'acides gras sans double liaison, rapportée à 100 grammes de produit." },
        { name: 'Acides gras monoinsaturés',id: 19060, compulsory: false, legend: "La quantité totale d'acides gras avec une double liaison cis, rapportée à 100 grammes de produit." },
        { name: 'Acides gras polyinsaturés',id: 19061, compulsory: false, legend: "La quantité totale d'acides gras avec deux (ou plus) doubles liaisons interrompues cis ou cis-méthylène, rapportée à 100 grammes de produit." },
        { name: 'Acides gras trans',        id: 19062, compulsory: false, legend: "" },
        { name: 'Cholestérol',              id: 19063, compulsory: false, legend: "" },
        { name: 'Oméga 3',                  id: 19064, compulsory: false, legend: "" },
        { name: 'Oméga 6',                  id: 19065, compulsory: false, legend: ""  },
        { name: 'Rapport gras',             id: 19066, compulsory: false, legend: ""  },
        { name: 'Glucides',                 id: 19067, compulsory: true,  legend: "La quantité totale de tous les glucides métabolisés par l’homme, y compris les polyols, rapportée à 100 grammes de produit." },
        { name: 'Sucres',                   id: 19068, compulsory: true,  legend: "La quantité totale de tous les monosaccharides et disaccharides présents dans une denrée alimentaire, à l’exclusion des polyols, rapportée à 100 grammes de produit." },
        { name: 'Polyols',                  id: 19069, compulsory: false, legend: "La quantité totale de tous les alcools comprenant plus de deux groupes hydroxyles, rapportée à 100 grammes de produit." },
        { name: 'Amidon',                   id: 19070, compulsory: false, legend: "" },
        { name: 'Fibres alimentaires',      id: 19071, compulsory: true,  legend: "La quantité totale de fibres alimentaires, rapportée à 100 grammes de produit. Il s'agit des polymères glucidiques composés de trois unités monomériques ou plus, qui ne sont ni digérés ni absorbés dans l’intestin grêle humain et appartiennent à l’une des catégories suivantes: - polymères glucidiques comestibles, présents naturellement dans la denrée alimentaire telle qu’elle est consommée, - polymères glucidiques comestibles qui ont été obtenus à partir de matières premières alimentaires brutes par des moyens physiques, enzymatiques ou chimiques et ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises, - polymères glucidiques comestibles synthétiques qui ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises." },
        { name: 'Protéines',                id: 19072, compulsory: true,  legend: "La teneur en protéines, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>protéines = azote total (Kjeldahl) &times; 6,25</code>" },
        { name: 'Sel',                      id: 19073, compulsory: true,  legend: "La teneur en équivalent en sel, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>sel = sodium &times; 2,5</code>." },
        { name: 'Eau',                      id: 19074, compulsory: false, legend: "" },

        { name: 'Vitamine A',               id: 18978, compulsory: false, legend: "" },
        { name: 'Vitamine B1',              id: 18739, compulsory: false, legend: "" },
        { name: 'Vitamine B2',              id: 18740, compulsory: false, legend: "" },
        { name: 'Vitamine B3',              id: 18741, compulsory: false, legend: "" },
        { name: 'Vitamine B5',              id: 18744, compulsory: false, legend: "" },
        { name: 'Vitamine B6',              id: 18983, compulsory: false, legend: "" },
        { name: 'Vitamine B8',              id: 18743, compulsory: false, legend: "" },
        { name: 'Vitamine B9',              id: 18742, compulsory: false, legend: "" },
        { name: 'Vitamine B11',             id: 18984, compulsory: false, legend: "" },
        { name: 'Vitamine B12',             id: 18985, compulsory: false, legend: "" },
        { name: 'Vitamine C',               id: 18982, compulsory: false, legend: "" },
        { name: 'Vitamine D',               id: 18979, compulsory: false, legend: "" },
        { name: 'Vitamine E',               id: 18980, compulsory: false, legend: "" },
        { name: 'Vitamine K',               id: 18981, compulsory: false, legend: "" },
        { name: 'Vitamine H',               id: 18986, compulsory: false, legend: "" },

        { name: 'Aluminium',                id: 19075, compulsory: false, legend: "" },
        { name: 'Arsenic',                  id: 19076, compulsory: false, legend: "" },
        { name: 'Bore',                     id: 19077, compulsory: false, legend: "" },
        { name: 'Calcium',                  id: 18989, compulsory: false, legend: "" },
        { name: 'Chlore',                   id: 18988, compulsory: false, legend: "" },
        { name: 'Chrome',                   id: 18998, compulsory: false, legend: "" },
        { name: 'Cobalt',                   id: 19078, compulsory: false, legend: "" },
        { name: 'Cuivre',                   id: 18994, compulsory: false, legend: "" },
        { name: 'Fer',                      id: 18992, compulsory: false, legend: "" },
        { name: 'Fluor',                    id: 18996, compulsory: false, legend: "" },
        { name: 'Iode',                     id: 19000, compulsory: false, legend: "" },
        { name: 'Magnésium',                id: 18991, compulsory: false, legend: "" },
        { name: 'Molybdène',                id: 18999, compulsory: false, legend: "" },
        { name: 'Nickel',                   id: 19079, compulsory: false, legend: "" },
        { name: 'Phosphore',                id: 18990, compulsory: false, legend: "" },
        { name: 'Plomb',                    id: 19080, compulsory: false, legend: "" },
        { name: 'Potassium',                id: 18987, compulsory: false, legend: "" },
        { name: 'Sodium',                   id: 19081, compulsory: false, legend: "" },
        { name: 'Souffre',                  id: 19082, compulsory: false, legend: "" },
        { name: 'Silicium',                 id: 19083, compulsory: false, legend: "" },
        { name: 'Sélénium',                 id: 18997, compulsory: false, legend: "" },
        { name: 'Vanadium',                 id: 19084, compulsory: false, legend: "" },
        { name: 'Zinc',                     id: 18993, compulsory: false, legend: "" },
    ];

    $scope.pnqs = {}
    pnqs.map(function(pnq) {
        $scope.pnqs[pnq.id] = {
            isConceptualizedBy: {
                id: pnq.id,
                name: pnq.name,
                compulsory: pnq.compulsory,
            },
            isMeasuredBy: {
                id: 3,
                name: 'g',
            },
            quantity: null,
            name: null,
            percentageOfDailyValueIntake: null,
        };
    });

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.addPSQ = function() {
        var psq = new ProductStandardQuantity();
        $scope.psqs.push(psq);
        return;
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/nutrition/psq.html',
            controller: ProductStandardQuantityModalController,
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; }
            }
        });

        modalInstance.result.then(function (psq) {
            $scope.psqs.append(psq);
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    $$sdkCrud.ProductStandardQuantityList({}, {'partitions_id': $scope.product.id}).success(function(response){
        var psq;
        for (var i = 0; i <response.data.length; i++) {
            psq = new ProductStandardQuantity().fromJson(response.data[i]);
            $scope.psqs.push(psq);
        }
        console.log("Current PSQs : ");
        console.log($scope.psqs);
    });
    $scope.$watch('psqs', function(){
        console.log('Modified');
    }, true)
}]);


angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowWineCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {
    //$scope.select2countryOptions = $$autocomplete.getOptionAutocompletes('country', {maximumSelectionSize: 1, multiple: false});
    //$scope.select2regionOptions = $$autocomplete.getOptionAutocompletes('region', {maximumSelectionSize: 1, multiple: false});
    //$scope.select2appellationOptions = $$autocomplete.getOptionAutocompletes('appellation', {maximumSelectionSize: 1, multiple: false});
    //$scope.select2varietalOptions = $$autocomplete.getOptionAutocompletes('varietal', {multiple: true});
    //$scope.select2glassOptions = $$autocomplete.getOptionAutocompletes('glass', {maximumSelectionSize: 1, multiple: false});
}]);

/**
 * Page that displays all the elements that describe a given Brand.
 *
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $$sdkCrud    [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} permission)  [description]
 * @return {[type]}              [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {maximumSelectionSize: 1});
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {maximumSelectionSize: 1, multiple: false});
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {data:[], multiple: false, maximumSelectionSize: 1});
    $scope.select2synonymsOptions = {
        multiple: true,
        simple_tags: true,
        tags: []
    }

    $scope.user = {};
    $scope.product = {
        id: $routeParams.id,
        isPartitionedBy: []
    };
    $scope.completeness = 0;


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    var isEmpty = function (value) {
        return typeof(value) === 'undefined' || value === '' || value === null || value !== value;
    }
    $scope.check = function(field) {
        var classes = {};
        if(!$scope.productForm[field]) {
            return [];
        }
        if ($scope.productForm[field].$invalid) {
            if (isEmpty($scope.productForm[field].$viewValue)) {
                classes['has-warning'] = true;
            } else {
                classes['has-error'] = true;
            }
        }
        if ($scope.productForm[field].$valid) {
            if (isEmpty($scope.productForm[field].$viewValue)) {
                // Empty fields that are not required should not be displayed green
            } else {
                classes['has-success'] = true;
            }
        }
        return classes;
    }

    $scope.$watch('product', function() {
        $scope.completeness = computeScore($scope.product, $scope.productForm);
        inferProduct($scope.product, $scope.productForm);
    }, true);

    $scope.submit = function() {
        $$sdkCrud.ProductUpdate(
            $scope.product, null
        ).success(function(response) {
            load($scope.product.id);
        }).error(function(response) {
            alert('Erreur pendant la mise à jour du produit.');
        });
    };

    $scope.certify = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/certification.html',
            controller: ProductCertificationModalController,
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; },
                user: function () {return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.accept = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/certify/acceptation.html',
            controller: ProductAcceptationModalController,
            resolve: {
                $$sdkCrud: function () {return $$sdkCrud; },
                product: function () {return $scope.product; },
                user: function () {return $scope.user; }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $location.path('/maker/product');
        });
    };

    $scope.predict = function(product) {
        $scope.prediction.visible = true;
        $scope.prediction.concept = {
            name: 'vin rouge',
        };
        $scope.prediction.tab = 'wine';
    };
    $scope.verify = function() {
        if ($scope.prediction.correct) {
            $scope.tabs[$scope.prediction.tab].visible = true;
        }
    };
    $scope.partners = function(productInShop) {
        return [1, 2, 7, 66, 67, 10].indexOf(productInShop.isSoldBy.id) !== -1;
    }

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

    var load = function(id) {
        $$sdkCrud.ProductShow(id, true, function(response){
            var product = new Product().fromJson(response.data);
            product.isMeasuredBy.text = product.isMeasuredBy.name;
            product.isBrandedBy.text = product.isBrandedBy.name;
            product.madeOf = [];
            product.hasVarietal = [];
            product.isPartitionedBy = [];

            $scope.product = product;

            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1,
            }, {
                filter_isbrandedby_id: $scope.product.isBrandedBy.id
            });

            if (!$scope.product.isAccepted()) {
                $scope.accept();
            };
        });
    };
    permission.getUser().then(function(user){
        $scope.user = user;
        user.managesBrand.forEach(function(brand){
            $$sdkCrud.BrandShow(brand.id).success(function(response){
                brand.name = response.data.name;
                brand.text = response.data.name;
            });
        });
        angular.extend($scope.select2brandOptions.data, user.managesBrand);
    });

    load($scope.product.id);
}]);



var computeScore = function(product, productForm) {
    var total = 0, ok = 0;
    for (var key in productForm) {
        if (!productForm.hasOwnProperty(key)
        || angular.isUndefined(productForm[key].$error)
        || angular.isUndefined(productForm[key].$error.required)) {
            continue;
        }
        total += 1;
        if (productForm[key].$error['required'] == false) {
            ok += 1;
        }
    }
    return ok * 100 / total;
};

var readablePackaging = function(product) {
    var packaging = '';
    if (product.factorPA && product.packagingName) {
        packaging += product.factorPA + ' ' + product.packagingName + '(s) ';
        packaging += ' de '
    }
    if (product.isSplitable && product.factorFUPA && product.unitFridge) {
        packaging += product.factorFUPA + ' ' + product.unitFridge + '(s) ';
    }
    if (!product.isMeasuredBy || !product.isMeasuredBy.name) {
        return '';
    }
    packaging += ' de '
    packaging += product.factorSIFU + ' ' + product.isMeasuredBy.name;
    return packaging;
};

var inferProduct = function(product, productForm) {
    if (product.composition) {
        var text = product.composition;
        if (text.indexOf('lait') !== -1) {
            product.hasLactose = true;
        }
        if (text.indexOf('saindoux') !== -1){
            product.hasSaindoux = true;
        }
        if (text.indexOf('huile de palme' ) !== -1){
            product.hasOilPalm = true;
            product.hasRiskOilPalm = true;
        }
        if (text.indexOf('huile de colza' ) !== -1){
            product.hasOilCoprah = true;
        }
        if (text.indexOf('huile de coco' ) !== -1){
            product.hasOilCoconut = true;
        }
        if (text.indexOf('beurre' ) !== -1){
            product.hasButter = true;
        }
        if (text.indexOf('huile de tournesol' ) !== -1){
            product.hasOilSunflower = true;
        }
        if (text.indexOf('huile d\'olive' ) !== -1){
            product.hasOilOlive = true;
        }
        if (text.indexOf('crème') !== -1 || text.indexOf('creme') !== -1 || text.indexOf('crême') !== -1){
            product.hasCream = true;
        }
        if (text.indexOf('huile de pépins de raisin' ) !== -1){
            product.hasOilGrapeSeed = true;
        }
        if (text.indexOf('huile de pépins de raisin' ) !== -1){
            product.hasOilCanola = true;
        }
    }
    if (product.isPack === false && isEmpty(product.factorPA)) {
        product.factorPA = 1;
    }
    if (product.factorPA > 1) {
        product.isSplitable = true;
    }
    if (product.factorFUPA > 1) {
        product.isSplitable = true;
    }
    if (isEmpty(product.packaging)) {
        product.packaging = readablePackaging(product);
    }
    if (product.amountStarch !== null) {
        product.hasStarch = true;
    }

    return product;
}

