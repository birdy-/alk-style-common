'use strict';

/**
 * Page that displays all the elements that describe a given Brand.
 *
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $$sdkCrud    [description]
 * @param  {[type]} permission)  [description]
 * @return {[type]}              [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandListController', [
    '$scope', '$$BrandRepository', 'permission', '$window',
    function ($scope, $$BrandRepository, permission, $window) {

    $scope.brands = [];
    permission.getUser().then(function (user) {
        user.managesBrand.forEach(function(brand){
            $$BrandRepository.get(brand.id).then(function(brand){
                $scope.brands.push(brand);
            });
        });
    });

    $scope.submit = function() {
        $window.alert('You do not have the necessary privileges to update this brand.');
    };
}]);

