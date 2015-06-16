'use strict';
/**
 * Service that launch modal, toast on various error
 *
 */
angular.module('jDashboardFluxApp')

.run([
    '$rootScope', '$modal',
    function init ($rootScope, $modal) {
         var displayPaymentErrorModal = function (data) {
                $modal.open({
                    templateUrl: 'src/common/error/error.payment.html',
                    controller: 'ErrorPaymentModalController',
                    resolve: {
                    }
                });
        };

        $rootScope.$on('Error.HTTP.402', displayPaymentErrorModal);

        return {};
}])
.controller('ErrorPaymentModalController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.close = function () {
        $modalInstance.dismiss(null);
    };
}]);
