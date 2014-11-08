'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowProductInShopController', [
    '$scope', '$$sdkCrud',
    function ($scope, $$sdkCrud) {

        $scope.productInShops = [];

        var partners = function(productInShop) {
            return [1, 2, 7, 10, 67, 65, 74, 75, 12].indexOf(productInShop.isSoldBy.id) !== -1;
        };

        $scope.$watch('product.id', function(productId){
            if (!productId) {
                return;
            }
            $$sdkCrud.ProductIsInstantiatedBy(productId).then(function(response){
                $scope.productInShops = response.data.data.isInstantiatedBy.filter(partners);
            });
        });

}]);