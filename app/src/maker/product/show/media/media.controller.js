'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaUploadController', [
    '$scope', '$modalInstance', '$document', '$log', '$routeParams', '$route', 'URL_CDN_MEDIA', '$$sdkMedia',
    function($scope, $modalInstance, $document, $log, $routeParams, $route, URL_CDN_MEDIA, $$sdkMedia) {

        $scope.form = {
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1
              }
        };

        $log.debug('Init UploadAdController');

        // for the directive mics-pl-upload
        $scope.uploadedFiles = [];
        $scope.productId = $routeParams.id;
        $scope.message = 'Glisser / Déposer les fichiers ici.';
        $scope.total = null;

        // for the page

        $scope.newPictures = [];

        $scope.$watchCollection("uploadedFiles", function (newFiles) {
            while(newFiles.length) {
                var file = newFiles.pop();
                $log.info("got new uploaded file, pushing as asset", file);
                
                // Update the url of the picture
                file.data.path = URL_CDN_MEDIA + file.data.path;                
                $scope.newPictures.push(file.data);
            }            
        });        

        $scope.done = function() {
            // Add logic to select the packshot one
            // Add logic to select the face one
            var wrapper = $scope.newPictures;

            var callback = function(){
                $modalInstance.close();    
            };
            for (var i = 0; i < wrapper.length; i++) {
                saveProductPicture(wrapper[i], callback);                
            }            

        };


        var saveProductPicture = function (newPicture, callback) {
            $log.debug('Saving picture for <Product ' + newPicture.entity_id + '>', newPicture);            

            var payload = {
                entity_id: newPicture.entity_id,
                entity_type: newPicture.entity_type,
                picture_data: newPicture
            };

            // Duplicate content
            if (newPicture.contentType === ProductPicture.TYPE_OF_CONTENT_PACKAGED.id) {
                newPicture.typeOfInformation = ProductPicture.TYPE_OF_INFORMATION_PACKAGED.id;
            } else {
                newPicture.typeOfInformation = ProductPicture.TYPE_OF_INFORMATION_UNPACKAGED.id;
            }


            // Default variables
            payload.picture_data.canFilesBeEdited = false;
            payload.picture_data.isFileBackgroundTransparent = false;
            payload.picture_data.fileType = ProductPicture.TYPE_PICTURE_DEFINITION_STANDARD.id;
            payload.picture_data.uniformResourceIdentifier = newPicture.path;
            payload.picture_data.gtin = $scope.product.isIdentifiedBy[0].reference;

            $log.debug('MediaPictureEntityPostRequest', payload);
            $$sdkMedia.EntityPicturePost(payload).success(function(response){
                $log.debug('MediaPictureEntityPostRequest Ok', response);                
                callback();
            });

        };

        $scope.cancel = function() {
            $modalInstance.close();
        };

        $modalInstance.opened.then(function(){
        });
    }
]);


angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaController', [
    "$scope", "$modal", "$log", "$$sdkMedia",
    function($scope, $modal, $log, $$sdkMedia) {

        $scope.productPictures = [];

        var fetchPictures = function (productId) {
            var entity_type = 'product';
            $log.debug('EntityPictureGetRequest');
            $$sdkMedia.EntityPictureGet(entity_type, productId).success(function (response) {
                $log.debug('EntityPictureGetRequest OK', response);
                $scope.productPictures = response.data;
            });
        };

        $scope.selectAsPackshot = function (picture) {
            $log.debug('selectAsPackshot', picture);            
            var payload = {
                entity_type: 'product',
                entity_id: picture.product_id,
                entityPicture_id: picture.id,
                picture_standard_type: 'packshot'
            };
            $log.debug('MediaPictureStandardPostRequest', payload);

            $$sdkMedia.EntityStandardPost(payload).success(function(response){
                $log.debug('MediaPictureStandardPostRequest Ok', response);                
                alert('Nous avons bien pris en compte votre demande. Le visuel va être mis à jour. Cette opération peut prendre quelque temps, merci pour votre patience.');
            });
        };

        $scope.$watch('product.id', function(value) {
            if (value == null) {
                return;
            }
            fetchPictures(value);
        });

        // upload new pictures
        $scope.uploadNewPictures = function(mediaType, multiSelection) {
            $scope.mediaType = mediaType;
            $scope.multiSelection = multiSelection;
            // display pop-up
            var uploadModal = $modal.open({
                templateUrl: 'src/maker/product/show/media/upload-picture.html',
                scope : $scope,
                backdrop : 'static',
                controller: 'DashboardMakerProductShowMediaUploadController'
            });

            uploadModal.result.then(function () {   
                // after upload, will also fetch the newly uploaded pictures
                fetchPictures($scope.product.id);
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());              
            });
        };

    }
]);