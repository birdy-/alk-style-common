'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerNotificationsController', [
    'permission', '$scope', '$$sdkTimeline', '$$sdkCrud', '$log',
    function (permission, $scope, $$sdkTimeline, $$sdkCrud, $log) {

    var ids = [];

    var resx = {
        'ProductCertified' : {'icon': 'fa-gavel', 'color': 'color-green-inverse'},
        'ProductInShopProductCertified' : {'icon': 'fa-gavel', 'color': 'color-green-inverse'},
        'ProductUpdated': {'icon': 'fa-gavel', 'color': 'color-green-inverse'},
        'ProductPictureUploaded' : {'icon': 'fa-picture-o', 'color': 'color-yellow-inverse'},
        'ProductCommented' : {'icon': 'fa-comment', 'color': 'color-blue-inverse'},
        'PlatformNewFeature' : {'icon': 'fa-info-circle', 'color': 'color-purple-inverse'},
        'ProductFillReminder' : {'icon': 'fa-check-square-o', 'color': 'color-yellow-inverse'},
        'ProductErrorReported' : {'icon': 'fa-warning', 'color': 'color-red-inverse'}
    };

    var certif = {
        1: 'a accepté de remplir la fiche du produit',
        2: 'a certifié le produit',
        3: 'a publié le produit',
        6: 'a archivé un produit'
    };

    var get = function (user_id) {
        return $$sdkTimeline.TimelineGet(user_id).then(function(response) {
            $scope.notifications = response.data.data;
            for (var i in $scope.notifications) {
                $scope.notifications[i]['resx'] = resx[$scope.notifications[i]['event']['type']];
                if ($scope.notifications[i]['event']['data']['certified']) {
                    $scope.notifications[i]['certif'] = certif[$scope.notifications[i]['event']['data']['certified']];
                }
            };
            $scope.notif_cnt = response.data.data.length;
        });
    };

    permission.getUser().then(function(user){
        ids = user.managesShop.map(function(shop){
            return shop.id;
        });
        $scope.shop = {
            id: ids[0]
        };
        get(user.id);
    });
    $scope.notif_cnt = 0;
    $scope.products = [];
    $scope.shop = {
        id: 1
    };
    $$sdkCrud.ShopShow($scope.shop.id, function(response){

        $log.log(response.data);
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
angular.module('jDashboardFluxApp').controller('DashboardRetailerProductShowController', [
    '$scope', '$$sdkCrud', '$routeParams', '$window',
    function ($scope, $$sdkCrud, $routeParams, $window) {

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
            if (productInShop.isSoldBy.id === $scope.shop.id) {
                id = productInShop.id;
                found = true;
                break;
            }
        }
        if (!found) {
            $window.alert('Product not sold in this shop.');
        }
        $$sdkCrud.ProductInShopShow(id, function(response){
            $scope.productInShop = response.data;
        });
    });
}]);
