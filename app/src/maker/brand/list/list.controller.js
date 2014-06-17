'use strict';

/**
 * Page that displays all the elements that describe a given Brand.
 *
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $$sdkCrud    [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} permission)  [description]
 * @return {[type]}              [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandListCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', 'permission',
    function ($scope, $$sdkCrud, $routeParams, permission) {

    $scope.brands = [];
    permission.getUser().then(function (user) {
        $scope.brands = user.managesBrand;
        $scope.brands.forEach(function(brand){
            $$sdkCrud.BrandShow(brand.id, function(response){
                angular.copy(response.data, brand);
            });
        });
    });

    $scope.submit = function() {
        alert('You do not have the necessary privileges to update this brand.');
    };
}]);

