'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaController', [
    '$scope', '$modal', '$log', '$$sdkMedia', '$window', '$q', 'permission', '$$sdkTimeline',
    function($scope, $modal, $log, $$sdkMedia, $window, $q, permission, $$sdkTimeline) {

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

                permission.getUser().then(function (user) {

                    var makerUserId = 842;
                    var retailerUserId = 857;
                    var photographerUserId = 891;

                    var notification = {
                        event: {
                            timestamp: moment().unix(),
                            type: 'MakerProductClaimByRetailer',
                            data: {
                                claimDate: moment().set({'year': 2015, 'month': 4, 'date': 27}).format('DD MMM YYYY'),
                                claimer: {
                                    name: 'Carrefour',
                                    photographer: {
                                        name: 'ProductPhoto',
                                        address: '8 rue du Sentier, 75002 Paris'
                                    }
                                },
                                product: {
                                    reference: '3663215010508',
                                    name: 'Smoothie Orange Bio 1L',
                                    manufacturerName: 'Alkemics Brand',
                                    photographerName: 'ProductPhoto',
                                    urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                                }
                            }
                        }
                    };

                    if (user.id === makerUserId) {
                        // Warn the maker
                        var newEvent = {
                            entity_type: 'MakerProductTechnicalValidation',
                            timestamp: moment().unix(),
                            type: 'MakerProductTechnicalValidation',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductTechnicalValidation',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            console.log(response);
                        });

                        // Warn the photographer
                        var newEvent = {
                            entity_type: 'PhotographerProductValidation',
                            timestamp: moment().unix(),
                            type: 'PhotographerProductValidation',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'PhotographerProductValidation',
                            user_id: photographerUserId,
                            event: newEvent
                        }).then(function (response) {
                            console.log(response);
                        });
                    }

                    if (user.id === photographerUserId) {
                        // Warn the maker
                        var newEvent = {
                            entity_type: 'MakerProductValidation',
                            timestamp: moment().unix(),
                            type: 'MakerProductValidation',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductValidation',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            console.log(response);
                        });

                        // Warn the retailer
                        var newEvent = {
                            entity_type: 'RetailerProductUploadedByPhotographer',
                            timestamp: moment().unix(),
                            type: 'RetailerProductUploadedByPhotographer',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'RetailerProductUploadedByPhotographer',
                            user_id: retailerUserId,
                            event: newEvent
                        }).then(function (response) {
                            console.log(response);
                        });
                    }
                });
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

            permission.getUser().then(function (user) {
                $scope.user = user;
                $scope.isPhotographer = (+user.id === 891);
                $scope.isDemo = (+user.id === 891 || +user.id === 842);
            })
        };
        $scope.$watch('product.id', function(productId) {
            if (productId == null) {
                return;
            }
            fetchPictures(productId);
        });
    }
]);
