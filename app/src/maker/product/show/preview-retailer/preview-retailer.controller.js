'use_strict';

angular.module('jDashboardFluxApp')

.controller('DashboardMakerProductShowRetailerPreviewController', [

    '$scope', '$sce', 'productReference', '$modalInstance',
    function ($scope, $sce, productReference, $modalInstance) {
        // NB to create specific preview for retailers code has already been created
        // Check https://github.com/alkemics/dashboard-flux/blob/f808b4af1666d517ff6e662f63210f23c8767378/app/src/maker/product/show/preview-retailer/preview-retailer.controller.js
        var init = function () {
            $scope.previewUrl = $sce.trustAsResourceUrl('https://sassets.toc.io/interfaces/product/v2/index.html#/?productreference_reference=' + productReference + '&shop_id=1&jrmac=UA-0000-0&app_id=UA-0000-0&client_id=dashboard_stream&no_cache=1');
        };

        $scope.ok = function () {
            $modalInstance.close();
        }

        init();
    }
]);
