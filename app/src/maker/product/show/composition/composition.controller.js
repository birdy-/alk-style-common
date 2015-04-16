'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowCompositionController', [
    '$scope', '$modal', '$$sdkMl',
    function ($scope, $modal, $$sdkMl) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.suggest = {};

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    var checkComposition = function (value) {
        if (!value) {
            return;
        }
        // Sanitize HTML input for ML to work
        value = String(value).replace(/<[^>]+>/gm, '');
        $$sdkMl.ProductCompositionParse(value).then(function (response) {
            $scope.suggest = response.data.data;
        });
    };
    $scope.check = function () {
        checkComposition($scope.product.composition);
    };

    var initComposition = $scope.$watch('product.composition', function(newValue, oldValue){
        if (newValue !== undefined) {
            $scope.productForm.$setPristine();
            initComposition();
        }
    });

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------



}]);
