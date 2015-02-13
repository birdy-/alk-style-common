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
    '$scope', '$$ORM', 'permission', '$$sdkAuth',
    function ($scope, $$ORM, permission, $$sdkAuth) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.brands = [];
    $scope.claims = [];
    $scope.cachebuster = parseInt(Math.random() * 1000000);

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Initialization
    // ------------------------------------------------------------------------
    var init = function() {
        permission.getUser().then(function (user) {
            var brandIds = user.managesBrand.map(function (brand) {
                return brand.id
            });
            $$ORM.repository('Brand').list({}, {id: brandIds}).then(function (brands) {
                $scope.brands = brands;
            });
        });
        $$sdkAuth.UserClaimProductBrandList().then(function (response) {
            $scope.claims = response.data.data;
        });
    };
    init();
}]);
