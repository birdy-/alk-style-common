
/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @param  {[type]} $routeParams) [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerAssortmentCtrl', [
    '$scope', '$$sdkCrud', '$$sdkAdmin', '$$autocomplete',
    function($scope, $$sdkCrud, $$sdkAdmin, $$autocomplete) {

    $scope.request = {
        concept: [{id: 618, text:'bière blonde', _type: 'Concept'}],
        brand: {
            id: 2572
        }
    };
    $scope.conceptOptions = $$autocomplete.getOptionAutocompletes('concept', {maximumSelectionSize: 1});
    $scope.productinshops = [];

    var list = function() {
        $$sdkAdmin.AnalyticsConceptPrice($scope.request.concept[0].id, 1, function(response){
            $scope.productinshops = response.data;
        });
    };

    $scope.$watch('request.concept', list);

}]);

/**
 * [description]
 *
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} permission    [description]
 * @param  {[type]} $routeParams) [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerSalesCtrl', [
    '$scope', '$$sdkCrud', '$$sdkAdmin', '$$autocomplete',
    function($scope, $$sdkCrud, $$sdkAdmin, $$autocomplete) {

    $scope.request = {
        brand: {
            id: 2572
        }
    };
    $scope.productinshops = [];

    var list = function() {
        $$sdkCrud.ProductInShopList({}, {
            brand_id: $scope.request.brand.id,
            shop_shortId: 1
        }, {}, null, null, function(response){
            $scope.productinshops = response.data;
        });
    };

    list();
}]);
