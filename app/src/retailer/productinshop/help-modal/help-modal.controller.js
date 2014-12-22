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

        // $scope.cerificationItems = [
        //     Product.CERTIFICATION_STATUS_DEFAULT,
        //     Product.CERTIFICATION_STATUS_REVIEWING,
        //     Product.CERTIFICATION_STATUS_ATTRIBUTED,
        //     Product.CERTIFICATION_STATUS_ACCEPTED,
        //     Product.CERTIFICATION_STATUS_CERTIFIED,
        //     Product.CERTIFICATION_STATUS_PUBLISHED,
        //     Product.CERTIFICATION_STATUS_DISCONTINUED
        // ];
    }
]);
