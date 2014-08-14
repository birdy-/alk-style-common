'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMerchandisingCtrl', [
    '$scope', '$$autocomplete', 'permission',
    function ($scope, $$autocomplete, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.user = null;
    $scope.ProductIsSubstitutableWithProduct = ProductIsSubstitutableWithProduct;
    // $scope.ProductIsUpgradableByProduct = ProductIsUpgradableByProduct;
    $scope.ProductIsComplementaryWithProduct = ProductIsComplementaryWithProduct;
    $scope.ProductIsRequiredInRecipe = ProductIsRequiredInRecipe;

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function(user){
        $scope.user = user;
    });
}]);
