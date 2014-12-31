'use_strict';

angular.module('jDashboardFluxApp').controller('RetailerProductInShopHelpModalController', [
    '$scope', '$modalInstance',
    function ($scope, $modalInstance) {

        // ------------------------------------------------------------------------
        // Event binding
        // ------------------------------------------------------------------------
        $scope.ok = function () {
            $modalInstance.close();
        };
    }
]);
