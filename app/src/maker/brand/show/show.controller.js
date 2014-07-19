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
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', 'permission', '$location', '$modal',
    function ($scope, $$sdkCrud, $routeParams, permission, $location, $modal) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.brand = {};
    $scope.brandForm;


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
            alert('Erreur pendant la mise à jour de la marque'+message);
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


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var load = function() {
        $$sdkCrud.BrandShow($routeParams.id, {with_children: 1}).success(function(response){
            $scope.brand = response.data;
            $scope.brandForm.$loading = false;
        });
    };
    var init = function() {
        permission.getUser().then(function(user){
            if (!user.isAllowed('Brand', parseInt($routeParams.id))) {
                alert("Vous n'êtes pas autorisé à consulter cette page.");
                $location.path('/maker/brand');
                return;
            }
            load();
        });
    };
    init();

    // upload new pictures
    $scope.uploadNewPictures = function(mediaType, multiSelection) {

        $scope.mediaType = mediaType;
        $scope.multiSelection = multiSelection;
        // display pop-up
        var uploadModal = $modal.open({
            templateUrl: 'src/maker/brand/show/media/upload-brand.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'DashboardMakerBrandShowMediaUploadCtrl'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);



angular.module('jDashboardFluxApp').controller('DashboardMakerBrandShowMediaUploadCtrl', [
    '$scope', '$modalInstance', '$document', '$log', '$routeParams',
    function($scope, $modalInstance, $document, $log, $routeParams) {

        $log.debug('Init UploadAdController');

        // for the directive mics-pl-upload
        $scope.uploadedFiles = [];
        $scope.brandId = $routeParams.id;
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