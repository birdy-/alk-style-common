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
    '$scope', '$$BrandRepository', 'permission', '$$sdkAuth',
    function ($scope, $$BrandRepository, permission, $$sdkAuth) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.brands = [];
    $scope.claims = [];

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Initialization
    // ------------------------------------------------------------------------
    var init = function() {
        permission.getUser().then(function (user) {
            user.managesBrand.forEach(function(brand){
                $$BrandRepository.get(brand.id).then(function(brand){
                    $scope.brands.push(brand);
                });
            });
        });
        $$sdkAuth.UserClaimProductBrandList().then(function (response) {
            $scope.claims = response.data.data;
        });
    }
    init();
}]);
