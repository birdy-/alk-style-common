'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = {};
    $scope.product = {
        id: $routeParams.id,
        isPartitionedBy: []
    };
    $scope.select2brandOptions = $$autocomplete.getOptionAutocompletes(null, {
        data:[], multiple:false, maximumSelectionSize:1, minimumInputLength:0
    });

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