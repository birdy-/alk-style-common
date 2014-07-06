'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerNotificationsCtrl', [
    '$scope', '$$sdkCrud',
    function ($scope, $$sdkCrud) {

    $scope.products = [];
    $scope.shop = {
        id: 1
    };
    $$sdkCrud.ShopShow($scope.shop.id, function(response){
        $scope.shop = response.data;
    });
}]);

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerProductShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams',
    function ($scope, $$sdkCrud, $routeParams) {

    $scope.productInShop = {
    };
    $scope.product = {
        id: $routeParams.id
    };
    $scope.shop = {
        id: 1
    };

    $$sdkCrud.ProductShow($scope.product.id, {}, function(response){
        $scope.product = response.data;
        var id, productInShop, found = false;
        for (var i = 0; i < $scope.product.isInstantiatedBy.length; i++) {
            productInShop = $scope.product.isInstantiatedBy[i];
            if (productInShop.isSoldBy.id == $scope.shop.id) {
                id = productInShop.id;
                found = true;
                break;
            }
        }
        if (!found) {
            alert('Product not sold in this shop.');
        }
        $$sdkCrud.ProductInShopShow(id, function(response){
            $scope.productInShop = response.data;
        });
    });
}]);