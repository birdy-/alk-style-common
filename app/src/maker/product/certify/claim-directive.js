'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkButtonProductClaim', [
    '$modal',
    function ($modal) {
        scope.claim = function () {
            var modalInstance = $modal.open({
                templateUrl: '/src/maker/product/certify/claim.html',
                controller: 'ProductClaimModalController',
                resolve: {
                    brand: function() {
                        return scope.brand;
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    }
]);
