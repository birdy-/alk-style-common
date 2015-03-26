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
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandShowController', [
    '$scope', '$$sdkCrud', '$routeParams', 'permission', '$$sdkMedia', '$location', '$modal', '$window', '$log',
    function ($scope, $$sdkCrud, $routeParams, permission, $$sdkMedia, $location, $modal, $window, $log) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.brand = {};
    $scope.brandForm;
    $scope.cachebuster = parseInt(Math.random() * 1000000);
    $scope.pictures = [];

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.save = function(){
        $scope.brandForm.$saving = true;
        $$sdkCrud.BrandUpdate($scope.brand).success(function(response){
            $scope.brand = response.data;
            $scope.brandForm.$saving = false;
            $scope.brandForm.$setPristine();
        }).error(function(response){
            var message = '.';
            if (response && response.message) {
                message = ' : ' + response.message;
            }
            $window.alert('Erreur pendant la mise à jour de la marque'+message);
        });
    };

    $scope.status = function() {
        if($scope.brandForm.$pristine) {
            return ['ng-pristine'];
        }
        return ['ng-dirty'];
    };
    $scope.formInit = function(form) {
        form.$loading = true;
        form.$saving = false;
    };

    $scope.openClaimModal = function() {
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

    var loadPictures = function() {
        $$sdkMedia.EntityPictureGet('brand', $scope.brand.id).then(function (response) {
            $scope.pictures = response.data.data.map(function(json) {
                var picture = new BrandPicture();
                picture.fromJson(json);
                return picture;
            });
        });
    }

    $scope.selectAsLogo = function (picture) {
        $$sdkMedia.EntityStandardPost({
            entity_type: 'brand',
            entity_id: picture.brand_id,
            entityPicture_id: picture.id,
            picture_standard_type: 'logo'
        }).then(function(response){
            $window.alert('Nous avons bien pris en compte votre demande. Le visuel va être mis à jour. Cette opération peut prendre quelque temps, merci pour votre patience.');
        });
    };


    $scope.deletePicture = function (picture) {
        $$sdkMedia.EntityPictureDelete(
            'brand',
            picture.brand_id,
            picture.id
        ).success(function (response) {
            loadPictures();
        }).error(function (error) {
            if (error.status === 403) {
                $window.alert('Vous n\'avez pas les permissions nécessaires pour cette opération');
            } else {
                $window.alert('Une erreur est survenue : ' + error.message);
            }
        });
    };


    $scope.uploadNewPictures = function(mediaType, multiSelection) {

        $scope.mediaType = mediaType;
        $scope.multiSelection = multiSelection;
        // display pop-up
        var uploadModal = $modal.open({
            templateUrl: 'src/maker/brand/show/media/upload-brand.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'DashboardMakerBrandShowMediaUploadController'
        });

        uploadModal.result.then(function () {
            loadPictures();
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var load = function() {
        $$sdkCrud.BrandShow($routeParams.id, {with_subbrands: 1}).success(function(response){
            $scope.brand = response.data;
            $scope.brandForm.$loading = false;
            loadPictures();
        });
    };

    var init = function() {
        permission.getUser().then(function(user){
            if (!user.isAllowed('Brand', parseInt($routeParams.id, 10))) {
                $window.alert("Vous n'êtes pas autorisé à consulter cette page.");
                $location.path('/maker/brand');
                return;
            }
            load();
        });
    };
    init();


}]);


