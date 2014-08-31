'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowProductInShopController', [
    '$scope', '$$sdkCrud',
    function ($scope, $$sdkCrud) {

        $scope.$watch('product.id', function(productId){
            $$sdkCrud.ProductSearch(productId).then(function(response){
                console.log(response);
            });
        });

}]);