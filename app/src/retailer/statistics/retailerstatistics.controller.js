'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('RetailerDataStatisticsController', [
    '$scope', '$$sdkCrud', '$routeParams', '$window',
    function ($scope, $$sdkCrud, $routeParams, $window) {
    
    console.log('Loading Statistics Data...');
        var $$sdk = $$sdkCrud;
        var modelName = 'Statistics';

    var get = function () {
        return $$sdk[modelName + 'Show']().then(function(response) {
        	console.log(response.data);
        	$scope.stats = response.data;

        });
    };
    get();
}]);