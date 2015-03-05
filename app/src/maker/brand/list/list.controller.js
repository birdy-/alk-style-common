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
    '$scope', '$$ORM', 'permission', '$$sdkAuth', '$$sdkCrud',
    function ($scope, $$ORM, permission, $$sdkAuth, $$sdkCrud) {

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
                // Retrieve stats on brands
                var brandIds = brands.map(function (brand) { return brand.id })
                $$sdkCrud.BrandProductCertifiedStatistics(brandIds).then(function (response) {
                    var stats = response.data.data;
                    var statsByBrand = _.indexBy(stats, function(stat) {
                        return stat.about.id;
                    });
                    $scope.brands = _.map(brands, function (brand) {
                        brand.stats = statsByBrand[brand.id];
                        return brand;
                    });
                });
            });
        });
        $$sdkAuth.UserClaimProductBrandList().then(function (response) {
            $scope.claims = response.data.data;
        });
    };
    init();
}]);
