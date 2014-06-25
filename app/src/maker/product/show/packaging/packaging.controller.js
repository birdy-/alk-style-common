'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowPackagingCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', '$$autocomplete', '$modal', '$location', 'permission',
    function ($scope, $$sdkCrud, $routeParams, $$autocomplete, $modal, $location, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.select2productOptions = $$autocomplete.getOptionAutocompletes('product', {maximumSelectionSize: 1});
    $scope.select2commonunitOptions = $$autocomplete.getOptionAutocompletes('commonunit', {maximumSelectionSize: 1, multiple: false});

}]);


var readablePackaging = function(product) {
    var packaging = '';
    if (product.factorPA && product.packagingName) {
        packaging += product.factorPA + ' ' + product.packagingName + '(s) ';
        packaging += ' de '
    }
    if (product.isSplitable && product.factorFUPA && product.unitFridge) {
        packaging += product.factorFUPA + ' ' + product.unitFridge + '(s) ';
    }
    if (!product.isMeasuredBy || !product.isMeasuredBy.name) {
        return '';
    }
    packaging += ' de '
    packaging += product.factorSIFU + ' ' + product.isMeasuredBy.name;
    return packaging;
};
