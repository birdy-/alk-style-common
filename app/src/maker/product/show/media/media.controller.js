'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaUploadController', [
    '$scope', '$modalInstance', '$document', '$log', '$routeParams', '$route', 'URL_CDN_MEDIA', 'URL_SERVICE_MEDIA', '$http',
    function($scope, $modalInstance, $document, $log, $routeParams, $route, URL_CDN_MEDIA, URL_SERVICE_MEDIA, $http) {

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
            for (var i = 0; i < wrapper.length; i++) {
                saveProductPicture(wrapper[i]);
                // do nothing
            }
            $modalInstance.close();
        };


        var saveProductPicture = function (newPicture) {
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

            console.log(payload);

            $http.post(URL_SERVICE_MEDIA + '/media/v2/picture/entity', payload).success(function(response){
                $log.debug('MediaPictureEntityPostRequest Ok');
                console.log(response);
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
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

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

            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
]);