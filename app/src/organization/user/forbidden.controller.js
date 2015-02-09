"use strict";

/**
 * Modal that allows the user to register on the mailing list
 */
angular.module('jDashboardFluxApp').controller('OrganizationUserForbiddenController', [
    '$scope', '$modalInstance', '$$autocomplete', '$window', 'permission', 'administrators', 'title', 'action',
    function ($scope, $modalInstance, $$autocomplete, $window, permission, administrators, title, action) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.administrators = administrators;
    $scope.action = action;
    $scope.title = title;


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

}]);
