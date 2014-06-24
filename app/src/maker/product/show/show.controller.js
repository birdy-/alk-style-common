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
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {data:[], multiple: false, maximumSelectionSize: 1, minimumInputLength:0});
    $scope.select2synonymsOptions = {
        multiple: true,
        simple_tags: true,
        tags: []
    };

    $scope.user = {};
    $scope.product = {
        id: $routeParams.id,
        isPartitionedBy: []
    };
    $scope.completeness = 0;
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


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
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
    };
    $scope.suggestName = function() {


    };

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
        if (text.indexOf('glucose' ) !== -1){
            product.hasGlucose = true;
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

var isEmpty = function (value) {
    return typeof(value) === 'undefined' || value === '' || value === null || value !== value;
}
