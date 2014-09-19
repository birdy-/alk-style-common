'use_strict';

angular.module('jDashboardFluxApp').controller('DashboardMakerProductShowSegmentController', [
    '$scope', '$$sdkCrud', '$modal',
    function ($scope, $$sdkCrud, $modal) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.segments = [
    ];

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.addToSegment = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/product/show/segment/add.html',
            controller: 'ProductAddSegmentController',
            resolve: {
                product: function () {
                    return $scope.product;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.$watch('product.id', function(){
        if (!$scope.product.isBrandedBy) {
            return;
        }
        $scope.segments.push($scope.product.isBrandedBy);
    }, true);


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------

}]);