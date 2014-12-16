'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowController', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$location', '$window', 'URL_CDN_MEDIA',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $location, $window, URL_CDN_MEDIA) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};
    $scope.product = {};
    $scope.productId = null;
    $scope.productReference_reference = $routeParams.productReference_reference;
    $scope.productForm = {};
    $scope.formInit = function(form) {
        form.$loading = true;
        form.$saving = false;
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.check = function(field) {
        var classes = {};
        if(!$scope.productForm
        || !$scope.productForm[field]) {
            return [];
        }
        if ($scope.productForm[field].$invalid) {
            if (angular.isEmpty($scope.productForm[field].$viewValue)) {
                classes['has-warning'] = true;
            } else {
                classes['has-error'] = true;
            }
        }
        if ($scope.productForm[field].$valid) {
            if (angular.isEmpty($scope.productForm[field].$viewValue)) {
                // Empty fields that are not required should not be displayed green
            } else {
                classes['has-success'] = true;
            }
        }
        return classes;
    };

    $scope.discontinue = function (value) {
        if (value) {
            $scope.product.certified = Product.CERTIFICATION_STATUS_DISCONTINUED.id;
        } else {
            $scope.product.certified = Product.CERTIFICATION_STATUS_ACCEPTED.id;
        }
        $$sdkCrud.ProductCertify(
            $scope.product,
            $scope.product.certified,
            "1169"
        ).success(function(response){
            $location.path('/maker/brand/' + $scope.product.isBrandedBy.id + '/product');
        }).error(function(response){
            var message = '.';
            if (response && response.message) {
                message = ' : ' + response.message;
            }
            $window.alert("Erreur pendant l'archivage du produit : " + message);
        });
    };

    $scope.$watch('product', function () {
        // Prevents errors when clearing values
        var nulls = [
            'tempConsomation',
            'ratioCacao',
            'ratioAlcohol',
            'ratioFat',
            'levelPH',
            'serves',
            'factorSIFU',
            'factorFUPA',
            'quantityFree',
            'quantityBase',
            'quantityNormalized',
            'drainedWeight'
        ];
        var value;
        for (var i = 0; i < nulls.length; i++) {
            value = nulls[i];
            if ($scope.product[value] === "") {
                $scope.product[value] = null;
            }
        }
    }, true);

    $scope.$on('$locationChangeStart', function (event) {
        if ($scope.productForm.$pristine) {
            return;
        }
        if (!$window.confirm("Des changements n'ont pas été enregistrés, quitter quand même ?")) {
            event.preventDefault();
        }
    });

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var loadProduct = function (productId) {
        $scope.productForm.$loading = true;
        // Decide which data to load with the call
        var withs = {};
        withs.isIdentifiedBy = true;
        if ($location.path().indexOf('label') !== -1) {
            withs.isLabeledBy = true;
        } else if ($location.path().indexOf('packaging') !== -1) {
            withs.isMadeOf = true;
            withs.isDerivedFrom = true;
        } else if ($location.path().indexOf('merchandising') !== -1) {
            withs.isRequiredIn = true;
            withs.isSubstitutableWith = true;
            withs.isComplementaryWith = true;
        }
        // Actually perform the call
        $$sdkCrud.ProductShow(productId, withs).then(function(response){
            $scope.productForm.$loading = false;
            var product = new Product().fromJson(response.data.data);
            // Fill up for autocompletion reasons
            product.isMeasuredBy.text = product.isMeasuredBy.name;
            product.isBrandedBy.text = product.isBrandedBy.name;
            // Sort fields that requires to be ordered
            if (product.isSubstitutableWith) {
                product.isSubstitutableWith.sort(function (a, b) { return a.ranking > b.ranking; });
            }
            if (product.isComplementaryWith) {
                product.isComplementaryWith.sort(function (a, b) { return a.ranking > b.ranking; });
            }

            $scope.product = product;
            $scope.product.urlPictureOriginal = URL_CDN_MEDIA + '/product/' + $scope.product.id + '/picture/packshot/256x256.png?' + Math.random() * 100000000;
            $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {
                maximumSelectionSize: 1
            }, {
                filter_isbrandedby_id: $scope.product.isBrandedBy.id
            });
        });
    };

    var init = function () {
        $$sdkCrud.ProductReferenceList({}, {reference: $scope.productReference_reference}, undefined, undefined)
        .success(function (response) {
            var productId = response.data[0].identifies.id;
            loadProduct(productId);
        });
    };
    $scope.load = loadProduct;
    init();
}]);
