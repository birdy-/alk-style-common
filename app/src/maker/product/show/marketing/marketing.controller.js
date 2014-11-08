'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowMarketingController', [
    '$scope', '$$autocomplete', 'permission',
    function ($scope, $$autocomplete, permission) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.organization = null;

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function(user){
        $scope.organization = user.belongsTo[0];
    });
}]);
