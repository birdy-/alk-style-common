'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowSearchController', [
    '$scope', '$$sdkCrud',
    function ($scope, $$sdkCrud) {

        $scope.stats = {};
        $scope.datas = [];
        $scope.volumes = [];

        $scope.$watch('product.id', function(productId){
            if (!productId) {
                return;
            }
            $$sdkCrud.ProductSearch(productId).then(function(response){
                $scope.stats = [];
                var frequencies, volume, percentage;
                var volumes = [];
                for (var keyword in response.data.data) {
                    frequencies = response.data.data[keyword];
                    volume = 0;
                    for (var conceptId in frequencies) {
                        volume += frequencies[conceptId];
                    }
                    percentage = 100 * frequencies[conceptId] / volume;
                    $scope.stats.push({
                        keyword: keyword,
                        volume: volume,
                        percentage: percentage,
                        x: Math.log(volume), 
                        y: percentage, 
                        size: frequencies[conceptId]
                    });
                    volumes.push([
                        keyword, frequencies[conceptId]
                    ]);
                }
                $scope.datas.push({key: $scope.product.nameLegal, values: $scope.stats});
                $scope.volumes.push({key: $scope.product.nameLegal, values: volumes});
                
            });
        }, true);

}]);