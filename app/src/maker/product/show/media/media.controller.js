'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaController', [
    '$scope', '$modal', '$log', '$$sdkMedia', '$window', '$q',
    function($scope, $modal, $log, $$sdkMedia, $window, $q) {

        // --------------------------------------------------------------------------------
        // Variables
        // --------------------------------------------------------------------------------
        $scope.pictures = [];
        $scope.downloadInProgress = false;
        $scope.availables = {
            1: true,
            2: false,
            6: false,
            7: true,
            10: false,
            19: false,
            67: false,
            65: false
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

        $scope.downloadAllPictures = function () {
            $scope.downloadInProgress = true;
            var zip = new $window.JSZip();
            var allPicturesUrl = [];
            var allPicturesPromises = [];


            _.map($scope.pictures, function (picture) {
                allPicturesUrl.push(picture.uniformResourceIdentifier);
                var picturePromise = $q.defer();

                picture.uniformResourceIdentifier = picture.uniformResourceIdentifier.replace(/http:\/\/media/, 'https://smedia');

                $window.JSZipUtils.getBinaryContent(picture.uniformResourceIdentifier, function (err, data) {
                    if(err) {
                        $scope.$apply( function() {
                            picturePromise.reject(err);
                        });
                    } else {
                        $scope.$apply( function() {
                            zip.file("picture"+Math.random()+".png", data, {binary:true});
                            picturePromise.resolve(data);
                        });
                    }
                });
                allPicturesPromises.push(picturePromise.promise);
            });

            $q.all(allPicturesPromises)
            .then(function (results) {
                var blob = zip.generate({type:"blob"});
                var filename = moment().format('YYYY-MM-DD') + '-' + $scope.product.isIdentifiedBy[0].reference + '.zip';
                saveAs(blob, filename);
                $scope.downloadInProgress = false;
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
                picture.id,
                $scope.product.isBrandedBy.id // Obtained by inheritance
            ).success(function (response) {
                $window.alert('Nous avons bien pris en compte votre demande. Le visuel va être supprimé. Cette opération peut prendre quelque temps, merci pour votre patience. N\'hésitez pas à raffraichir la page.');
            }).error(function (error) {
                if (error.status === 403) {
                    $window.alert('Vous n\'avez pas les permissions nécessaires pour cette opération');
                } else {
                    $window.alert('Une erreur est survenue : ' + error.message);
                }
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
