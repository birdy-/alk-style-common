'use strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMediaUploadController', [
    '$scope', '$modalInstance', '$document', '$log', '$routeParams', '$route',
    function($scope, $modalInstance, $document, $log, $routeParams, $route) {

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
                $scope.newPictures.push({});
                // Make the picture visible
                // Don't know how to do that cleanly without additional network
                file.file.appendTo($('#uploaded-pictures'));


                // Upload has completed
                // User can still see the previous picture for two reasons:
                // A - the processing is asynchrone and slow
                // B - caching from storage / browser
                // A is handled by the setTimeout
                // B is handled by with cachebuster
                setTimeout(function(){
                    $route.reload();
                    $scope.done();
                }, 15000)
            }            


        });        

        $scope.done = function() {
            // Add logic to select the packshot one
            // Add logic to select the face one
            var wrapper = $scope.newPictures;
            for (var i = 0; i < wrapper.length; i++) {
                // saveCreativeWrapper(wrapper[i]);
                // do nothing
            }
            $modalInstance.close();
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