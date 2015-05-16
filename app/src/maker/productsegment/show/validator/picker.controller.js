'use_strict';

angular.module('jDashboardFluxApp').controller('ProductSegmentValidatorPickerController', [
    '$scope', '$$autocomplete', '$location', '$window', 'URL_CDN_MEDIA', '$modalInstance', 'permission', 'data',
    function ($scope, $$autocomplete, $location, $window, URL_CDN_MEDIA, $modalInstance, permission, data) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.data = data;
    $scope.response = {};

    // ------------------------------------------------------------------------
    // Event Binding
    // ------------------------------------------------------------------------
    $scope.cancel = function () {
        $modalInstance.dismiss(null);
    };

    $scope.submit = function () {
        $modalInstance.close($scope.response);
    };

}]);
