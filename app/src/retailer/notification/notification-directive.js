'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkNotification', [
    '$modal',
    function ($modal) {
        // Rendering definitions
        var icon = {
            'BrandClaimAccepted': 'fa-check-circle-o',
            'BrandClaimCreated': 'fa-info-circle',
            'BrandClaimErrored': 'fa-exclamation-triangle',
            'BrandClaimRefused': 'fa-times',
            'ProductCertified': 'fa-gavel',
            'ProductInShopProductCertified': 'fa-gavel',
            'ProductUpdated': 'fa-barcode',
            'ProductPictureUploaded': 'fa-picture-o',
            'ProductCommented': 'fa-comment',
            'PlatformNewFeature': 'fa-info-circle',
            'PlatformBrandWelcome': 'fa-info-circle',
            'ProductFillReminder': 'fa-check-square-o',
            'ProductErrorReported': 'fa-warning'
        };
        var color = {
             'BrandClaimAccepted': 'color-green-inverse',
             'BrandClaimCreated': 'color-blue-inverse',
             'BrandClaimErrored': 'color-orange-inverse',
             'BrandClaimRefused': 'color-error-inverse',
             'ProductCertified': 'color-green-inverse',
             'ProductInShopProductCertified': 'color-green-inverse',
             'ProductUpdated': 'color-green-inverse',
             'ProductPictureUploaded': 'color-yellow-inverse',
             'ProductCommented': 'color-blue-inverse',
             'PlatformNewFeature': 'color-purple-inverse',
             'PlatformBrandWelcome': 'color-purple-inverse',
             'ProductFillReminder': 'color-yellow-inverse',
             'ProductErrorReported': 'color-red-inverse'
        };
        return {
            restrict: 'AEC',
            scope: {
                notification: '=alkNotification'
            },
            templateUrl: '/src/retailer/notification/notification-directive.html',
            link: function(scope, elem, attrs) {
                scope.notification.icon = icon[scope.notification.event.type];
                scope.notification.color = color[scope.notification.event.type];
            }
        };
    }
]);