'use strict';

/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @param  {[type]} $routeParams) [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerProductListCtrl', [
    '$scope', '$$sdkCrud', 'permission', '$routeParams',
    function ($scope, $$sdkCrud, permission, $routeParams) {

    $scope.request = {
        product: {
            name: ''
        },
        productReference: {
            value: ''
        }
    };
    $scope.products = [];
    $scope.brand = {
    };
    $scope.user = {};
    $scope.scroll = {
        offset: 0,
        limit: 18,
        stop: false,
        busy: false,
    };

    permission.getUser().then(function (user) {
        $scope.user = user;
        $scope.brand = user.managesBrand[0];
        $$sdkCrud.BrandShow($scope.brand.id, function(response){
            $scope.brand = response.data;
            list();
        });
        return user;
    });

    var list = function() {
        if ($scope.scroll.stop) {
            console.warn("List Products : end reached.");
            return;
        }
        if ($scope.scroll.busy) {
            console.warn("List Products : busy.");
            return;
        }
        var brand = $scope.brand;
        if (!brand || !brand.id) {
            console.error("List Products : no Brand set.");
            return;
        }
        console.log("List Products : chunk [" + $scope.scroll.offset + "-" + ($scope.scroll.offset + $scope.scroll.limit) + "]" );
        $scope.scroll.busy = true;
        $$sdkCrud.ProductList({
                    product_name: $scope.request.product.name,
                }, {
                    brand_id: brand.id,
                    productreference_value: $scope.request.productReference.value
                },
                {},
                $scope.scroll.offset,
                $scope.scroll.limit,
                function(response){
            if (response.data.length < $scope.scroll.limit) {
                $scope.scroll.stop = true;
            }
            var product, productInShop;
            for (var i = 0; i < response.data.length; i ++) {
                product = response.data[i];
                product.status = Math.round(Math.random(), 0);
                if (product.status == 1) {
                    product.completeness = 100;
                } else {
                    product.completeness = Math.round(Math.random() * 100);
                }
                $scope.products.push(product);
            }
            $scope.scroll.busy = false;
            $scope.scroll.offset = $scope.products.length;
        });
    };

    $scope.more = function() {
        list();
    }
    var refresh = function() {
        $scope.scroll.offset = 0;
        $scope.scroll.stop = false;
        $scope.products = [];
        list();
    };

    $scope.$watch('request.productReference.value', refresh);
    $scope.$watch('request.product.name', refresh);

}]);