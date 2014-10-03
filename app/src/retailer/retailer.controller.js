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
 
     var mock_tl_response = {
        "data": [
            {
                "event_id": "5b26640a-6aa9-4d35-b8f2-61cd307cc15b",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412336489,
                    "type": "PlatformNewFeature"
                }
            },
            {
                "event_id": "57b79cfa-b2f9-483d-97e1-ab2de8cd460d",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412334489,
                    "type": "ProductCommented"
                }
            },
            {
                "event_id": "aa55870a-6d9c-41d7-b6bb-e4cc95b8d39d",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412333489,
                    "type": "ProductPictureUploaded"
                }
            },
            {
                "event_id": "bf917e7d-7d5b-46b4-98ee-84c2c6b52a32",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412333089,
                    "type": "ProductCertified"
                }
            },
            {
                "event_id": "cfc866fb-837f-4b19-bd6c-ab3755986fd4",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412333289,
                    "type": "ProductUpdated"
                }
            },
            {
                "event_id": "b318fbd7-4acb-4d7d-97bc-ca5d2c0b87ba",
                "user_id": 7,
                "event": {
                    "event_id": "{a08730c0-4ae8-11e4-916c-0800200c9a66}",
                    "timestamp": 1412321489,
                    "type": "ProductErrorReported"
                }
            }
        ]
    }

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
            $scope.notifications = mock_tl_response.data;//response.data.data;
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
        console.log(JSON.stringify(response));  
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
