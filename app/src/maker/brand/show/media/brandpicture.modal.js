
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandShowMediaUploadController', [
    '$scope', '$modalInstance', '$document', '$log', 'URL_CDN_MEDIA', '$$sdkMedia', '$routeParams',
    function($scope, $modalInstance, $document, $log, URL_CDN_MEDIA, $$sdkMedia, $routeParams) {

        $log.debug('Init UploadAdController');

        // for the directive mics-pl-upload
        $scope.uploadedFiles = [];
        $scope.brandId = $routeParams.id;
        $scope.message = 'Glisser / Déposer les fichiers ici.';
        $scope.total = null;
        $scope.progressValue = 0;

        // for the page
        $scope.newPictures = [];

        $scope.$watchCollection("uploadedFiles", function (newFiles) {
            while(newFiles.length) {
                var file = newFiles.pop();
                file.data.path = URL_CDN_MEDIA + file.data.path;

                $log.info("got new uploaded file, pushing as asset", file);
                picture = new BrandPicture();
                picture.fromJson(file.data);

                $scope.newPictures.push(picture);
                // Make the picture visible
                // Don't know how to do that cleanly without additional network
                file.file.appendTo($('#uploaded-pictures'));
            }
        });


        $scope.saveBrandPicture = function(newPicture, callback) {
            $log.debug('Saving picture for <Brand ' + newPicture.entity_id + '>', newPicture);

            var payload = {
                entity_id: newPicture.entity_id,
                entity_type: 'brand',
                picture_data: newPicture
            };

            payload.picture_data.uniformResourceIdentifier = newPicture.path;
            payload.picture_data.origin = BrandPicture.ORIGIN_STREAM_USER.id;
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
                $scope.saveBrandPicture(wrapper[i], callback);
            }
        };

        $scope.cancel = function() {
            $modalInstance.close();
        };

        $modalInstance.opened.then(function(){
        });
    }
]);
