'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkButtonProductClaim', [
    '$modal',
    function ($modal) {
        return {
            restrict: 'AEC',
            scope: {},
            templateUrl: '/src/maker/product/certify/claim-directive.html',
            link: function(scope, elem, attrs) {
                scope.claim = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/src/maker/product/certify/claim.html',
                        controller: 'ProductClaimModalController',
                        resolve: {
                            brand: function() {
                                return null;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                };
            }
        };
    }
]);