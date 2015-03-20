'use strict';

angular.module('jDashboardFluxApp').controller('MakerProceduresController', [
    '$scope', 'permission',
    function ($scope, permission) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.logged = false;
        $scope.user = {};

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        var init = function () {
            permission.getUser().then(function (user) {
                $scope.logged = true;
                $scope.user = user;
            });
        };
        init();
    }
]);
