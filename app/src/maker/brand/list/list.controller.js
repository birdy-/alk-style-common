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
    '$scope', '$$BrandRepository', 'permission', '$window', '$$sdkAuth', '$modal', '$log',
    function ($scope, $$BrandRepository, permission, $window, $$sdkAuth, $modal, $log) {

    $scope.brands = [];
    $scope.claims = [];

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

    $scope.listProductBrandClaims = function() {
        $$sdkAuth.UserClaimProductBrandList().then(
            function (data) {
                $scope.claims = data.data.data;
            }
        );
    }

    $scope.openClaimReferenceModal = function() {
        var claimModal = $modal.open({
            templateUrl: 'src/maker/product/certify/claim.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'ProductClaimModalController'
        });

        claimModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openClaimBrandModal = function() {
        var claimModal = $modal.open({
            templateUrl: 'src/maker/brand/list/claim.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'BrandClaimModalController'
        });

        claimModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.listProductBrandClaims();
}]);
