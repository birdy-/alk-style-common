'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaController', [
    "$scope", "$modal", "$log", "$$sdkMedia", "$window",
    function($scope, $modal, $log, $$sdkMedia, $window) {

        // --------------------------------------------------------------------------------
        // Variables
        // --------------------------------------------------------------------------------
        $scope.pictures = [];
        $scope.availables = {
            1: true,
            2: false,
            7: true,
            10: false,
            67: false,
            65: false,
            74: false,
            75: false
        };

        // --------------------------------------------------------------------------------
        // Event binding
        // --------------------------------------------------------------------------------
        $scope.selectAsPackshot = function (picture) {
            $$sdkMedia.EntityStandardPost({
                entity_type: 'product',
                entity_id: picture.product_id,
                entityPicture_id: picture.id,
                picture_standard_type: 'packshot'
            }).then(function(response){
                $window.alert('Nous avons bien pris en compte votre demande. Le visuel va être mis à jour. Cette opération peut prendre quelque temps, merci pour votre patience.');
            });
        };

        $scope.uploadNewPictures = function () {
            var uploadModal = $modal.open({
                templateUrl: 'src/maker/product/show/media/upload-picture.html',
                resolve: {
                    product: function () {
                        return $scope.product;
                    }
                },
                backdrop : 'static',
                controller: 'DashboardMakerProductShowMediaUploadController'
            });

            uploadModal.result.then(function () {
                fetchPictures($scope.product.id);
            }, function () {
            });
        };

        $scope.deletePicture = function (picture) {
            $$sdkMedia.EntityPictureDelete(
                'product',
                picture.product_id,
                picture.id
            ).then(function(response){
                $window.alert('Nous avons bien pris en compte votre demande. Le visuel va être supprimé. Cette opération peut prendre quelque temps, merci pour votre patience.');
            });
        };

        // --------------------------------------------------------------------------------
        // Init
        // --------------------------------------------------------------------------------
        var fetchPictures = function (productId) {
            $$sdkMedia.EntityPictureGet('product', productId).then(function (response) {
                $scope.pictures = response.data.data.map(function(json){
                    var picture = new ProductPicture();
                    picture.fromJson(json);
                    return picture;
                });
            });
        };
        $scope.$watch('product.id', function(productId) {
            if (productId == null) {
                return;
            }
            fetchPictures(productId);
        });
    }
]);