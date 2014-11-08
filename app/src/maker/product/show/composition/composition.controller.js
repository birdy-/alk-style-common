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
    var checkComposition = function(value) {
        if (!value) {
            return;
        }
        $$sdkMl.ProductCompositionParse(value).then(function(response){
            $scope.suggest = response.data.data;
        });
    };
    $scope.check = function(){
        checkComposition($scope.product.composition);
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------


}]);