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
            function (response) {
                $scope.claims = response.data.data;
            }
        );
    }

    $scope.openClaimReferenceModal = function(brand) {
        var claimModal = $modal.open({
            templateUrl: 'src/maker/product/certify/claim.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'ProductClaimModalController',
            resolve: {
                brand: function () {
                    return brand;
                }
            }
        });

        claimModal.result.then(function () {
            // If successful and
            // and claim a new product has been clicked
            $scope.openClaimReferenceModal(brand);
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
            // if successful
            // and clicked on claim a new brand
            $scope.openClaimBrandModal
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.listProductBrandClaims();
}]);
