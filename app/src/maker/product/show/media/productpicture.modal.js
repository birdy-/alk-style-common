'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaUploadController', [
    '$scope', '$modalInstance', '$log', 'URL_CDN_MEDIA', '$$sdkMedia', 'product',
    function($scope, $modalInstance, $log, URL_CDN_MEDIA, $$sdkMedia, product) {

        // --------------------------------------------------------------------------------
        // Variables
        // --------------------------------------------------------------------------------
        // Image upload directive
        $scope.uploadedFiles = [];
        $scope.product = product;
        $scope.mediaType = 'packshot';
        $scope.multiSelection = false;
        $scope.message = 'Glissez / déposez les fichiers ici';
        $scope.total = null;
        $scope.uploadError = null;

        // Form
        $scope.form = {
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1
            }
        };
        $scope.newPictures = [];

        // --------------------------------------------------------------------------------
        // Event binding
        // --------------------------------------------------------------------------------
        $scope.$watchCollection("uploadedFiles", function (newFiles) {
            var picture, file;
            while(newFiles.length) {
                file = newFiles.pop();
                file.data.path = URL_CDN_MEDIA + file.data.path;

                // Create a ProductPicture object
                $log.info("File successfully uploaded, creating ProductPicture", file);
                picture = new ProductPicture();
                picture.fromJson(file.data);

                // Set defaults
                picture.contentType = ProductPicture.TYPE_OF_CONTENT_PACKAGED.id;
                picture.angleVertical = ProductPicture.ANGLE_VERTICAL_PLONGEANTE.id;
                picture.angleHorizontal = ProductPicture.ANGLE_HORIZONTAL_LEFT.id;
                picture.productFace = ProductPicture.PRODUCT_FACE_DISPLAYED_FRONT.id;
                picture.fileEffectiveStartDateTime = new Date().getTime();
                picture.fileEffectiveEndDateTime = new Date().getTime();
                $scope.newPictures.push(picture);
            }
        });

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

            $$sdkMedia.EntityPicturePost(payload).then(callback);
        };

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

        $scope.cancel = function() {
            $modalInstance.close();
        };

        // --------------------------------------------------------------------------------
        // Init
        // --------------------------------------------------------------------------------

    }
]);