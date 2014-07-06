'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', 'permission', '$brandRepository', '$location',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, permission, $brandRepository, $location) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};
    $scope.product = {};
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });
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
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var load = function(id) {
        $scope.productForm.$loading = true;
        withs = {};
        if ($location.path().indexOf('label') !== -1) {
            withs.label = true;
        }
        if ($location.path().indexOf('packaging') !== -1) {
            withs.isMadeOf = true;
        }
        $$sdkCrud.ProductShow(id, withs, function(response){
            $scope.productForm.$loading = false;
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
        });
    };
    $scope.load = load;
    permission.getUser().then(function(user){
        $scope.user = user;
        user.managesBrand.forEach(function(brand){
            $brandRepository.get(brand.id);
        });
        angular.extend($scope.select2brandOptions.data, user.managesBrand);
    });

    $scope.load($routeParams.id);
}]);