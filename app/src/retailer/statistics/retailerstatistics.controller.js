'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('RetailerDataStatisticsController', [
    'permission', '$scope', '$$sdkCrud', '$routeParams', '$window', '$log',
    function (permission, $scope, $$sdkCrud, $routeParams, $window, $log) {
    
    $log.log('Loading Statistics Data...');
    var $$sdk = $$sdkCrud;
    var modelName = 'Statistics';
 	var ids = [];
	permission.getUser().then(function(user){
            ids = user.managesShop.map(function(shop){
                return shop.id;
            });
            get();
    });
    var get = function () {
        return $$sdk[modelName + 'Show'](['productinshop', 'product', 'productbrand'], ids[0]).then(function(response) {
        	$log.log(response.data);
        	$scope.stats = response.data;
        });
    };
}]);

angular.module('jDashboardFluxApp').controller('RetailerProductStatisticsController', [
    'permission', '$scope', '$$sdkCrud', '$routeParams', '$window', '$log',
    function (permission, $scope, $$sdkCrud, $routeParams, $window, $log) {
    
    $log.log('Loading Product Statistics Data...');
    var $$sdk = $$sdkCrud;
    var modelName = 'Statistics';
    var ids = [];
	permission.getUser().then(function(user){
            ids = user.managesShop.map(function(shop){
                return shop.id;
            });
            get();
    });

    var get = function () {
    	$log.log('User managesShop:' + ids);
        return $$sdk[modelName + 'Show'](['productinshop'], ids[0]).then(function(response) {
        	var pish = []
        	for (var i = 0; i < response.data['data'].length;i++) {
        		$log.log(response.data['data'][i])
        		if (response.data['data'][i]['type'] == 'ProductInShop') {
        			pish = response.data['data'][i];
        			pish['stats'][4] = {'value': (pish.stats[0]['value'] - (pish.stats[1]['value'] + pish.stats[2]['value'] + pish.stats[3]['value']))}
        			break;
        		}
        	}
        	$log.log(pish)
        	$scope.stats = pish;
        });
    };
    
}]);