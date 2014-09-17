angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowWineController', [
    '$scope', '$$autocomplete',
    function ($scope, $$autocomplete) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------

    $scope.select2countryOptions = $$autocomplete.getOptionAutocompletes('country', {maximumSelectionSize: 1, multiple: false});
    $scope.select2regionOptions = $$autocomplete.getOptionAutocompletes('region', {maximumSelectionSize: 1, multiple: false});
    $scope.select2appellationOptions = $$autocomplete.getOptionAutocompletes('appellation', {maximumSelectionSize: 1, multiple: false});
    $scope.select2varietalOptions = $$autocomplete.getOptionAutocompletes('varietal', {multiple: true});
    $scope.select2glassOptions = $$autocomplete.getOptionAutocompletes('glass', {maximumSelectionSize: 1, multiple: false});

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
}]);
