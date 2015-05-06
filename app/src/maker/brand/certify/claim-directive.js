'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkButtonBrandClaim', [
    '$modal',
    function ($modal) {
        return {
            restrict: 'AEC',
            scope: {
                label: '='
            },
            templateUrl: '/src/maker/brand/certify/claim-directive.html',
            link: function(scope, elem, attrs) {
                scope.buttonClass = attrs.alkButtonClass || 'btn-default';
                scope.claim = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/src/maker/brand/certify/claim-modal.html',
                        controller: 'BrandClaimModalController'
                    });
                    modalInstance.result.then(function () {
                    }, function () {
                    });
                };
            }
        };
    }
]);
