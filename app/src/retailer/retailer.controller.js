'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerNotificationsController', [
    'permission', '$scope', '$$sdkTimeline', '$log', '$$sdkCrud',
    function (permission, $scope, $$sdkTimeline, $log, $$sdkCrud) {
    var $$sdk = $$sdkTimeline;
    var modelName = 'Statistics';
    var ids = [];
    
    var resx = {
        'ProductCertified' : {'icon': 'fa-gavel', 'color': 'color-green-inverse'},
        'ProductUpdated': {'icon': 'fa-gavel', 'color': 'color-green-inverse'},
        'ProductPictureUploaded' : {'icon': 'fa-picture-o', 'color': 'color-yellow-inverse'},
        'ProductCommented' : {'icon': 'fa-comment', 'color': 'color-blue-inverse'},
        'PlatformNewFeature' : {'icon': 'fa-info-circle', 'color': 'color-purple-inverse'},
        'ProductFillReminder' : {'icon': 'fa-check-square-o', 'color': 'color-yellow-inverse'},
        'ProductErrorReported' : {'icon': 'fa-warning', 'color': 'color-red-inverse'}
    };
 
    function dateFormat(date, format) {
        format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate());
        format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
        format = format.replace("YYYY", date.getFullYear());
        format = format.replace("HH", date.getHours());
        format = format.replace("MM", date.getMinutes());
        return format;
    }

    var get = function () {
        return $$sdk['UserlineGet'](7).then(function(response) {
            $log.log(JSON.stringify(response.data));
            $scope.notifications = response.data.data;
            for (var i in $scope.notifications) {
                $scope.notifications[i]['event']['date'] = dateFormat(new Date($scope.notifications[i]['event']['timestamp']*1000), 'DD-MM-YYYY');
                $scope.notifications[i]['event']['time'] = dateFormat(new Date($scope.notifications[i]['event']['timestamp']*1000), 'HH:MM');
                $scope.notifications[i]['resx'] = resx[$scope.notifications[i]['event']['type']];
            };
            $scope.notifications[0]['icon'] = resx['ProductPictureUploaded'].icon; 
            $scope.notif_cnt = response.data.data.length;
        });
    };

    permission.getUser().then(function(user){
        ids = user.managesShop.map(function(shop){
            return shop.id;
        });
        get();
        $scope.shop = {
            id: ids[0]
        };
        get();
    });
    $scope.notif_cnt = 0;
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