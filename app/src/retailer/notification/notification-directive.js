'use strict';

/**
 * Directive that connects the login view to the authentication events broadcasted
 * on the event bus.
 */
angular.module('jDashboardFluxApp').directive('alkNotification', [
    function () {
        // Rendering definitions
        var icon = {
            'BrandClaimAccepted': 'fa-check-circle-o',
            'BrandClaimCreated': 'fa-info-circle',
            'BrandClaimErrored': 'fa-exclamation-triangle',
            'BrandClaimRefused': 'fa-times',
            'PlatformDemoVideo': 'fa-star',
            'ProductClaimAccepted': 'fa-check-circle-o',
            'ProductClaimCreated': 'fa-info-circle',
            'ProductClaimErrored': 'fa-exclamation-triangle',
            'ProductClaimRefused': 'fa-times',
            'ProductCertified': 'fa-gavel',
            'ProductInShopProductCertified': 'fa-gavel',
            'ProductUpdated': 'fa-barcode',
            'ProductPictureUploaded': 'fa-picture-o',
            'ProductCommented': 'fa-comment',
            'PlatformNewFeature': 'fa-info-circle',
            'PlatformBrandWelcome': 'fa-star',
            'ProductFillReminder': 'fa-check-square-o',
            'ProductErrorReported': 'fa-warning',
            'Discussion': 'fa-star'
        };
        var color = {
             'BrandClaimAccepted': 'color-green-inverse',
             'BrandClaimCreated': 'color-blue-inverse',
             'BrandClaimErrored': 'color-orange-inverse',
             'BrandClaimRefused': 'color-error-inverse',
             'PlatformDemoVideo': 'color-purple-inverse',
             'ProductClaimAccepted': 'color-green-inverse',
             'ProductClaimCreated': 'color-blue-inverse',
             'ProductClaimErrored': 'color-orange-inverse',
             'ProductClaimRefused': 'color-error-inverse',
             'ProductCertified': 'color-green-inverse',
             'ProductInShopProductCertified': 'color-green-inverse',
             'ProductUpdated': 'color-green-inverse',
             'ProductPictureUploaded': 'color-yellow-inverse',
             'ProductCommented': 'color-blue-inverse',
             'PlatformNewFeature': 'color-purple-inverse',
             'PlatformBrandWelcome': 'color-purple-inverse',
             'ProductFillReminder': 'color-yellow-inverse',
             'ProductErrorReported': 'color-red-inverse',
             'Discussion': 'color-green-inverse',
        };
        return {
            restrict: 'AEC',
            scope: {
                notification: '=alkNotification'
            },
            controller: function ($scope, $$sdkTimeline, permission) {
                $scope.sendAnswer = function(notification) {
                    permission.getUser().then(function (user) {
                        var new_event = {
                            'entity_id': notification.event.entity_id,
                            'timestamp': moment().unix(),
                            'type': 'Discussion',
                            'user_id': user.id,
                            'allow_response': true,
                            'data': {
                                'message': notification.event.answer,
                                'subject': '',
                                'timestamp': Math.floor(Date.now() / 1000),
                                'entity_id': notification.event.entity_id,
                                'type': 'Discussion',
                                'user': {
                                    'firstname': user.firstname,
                                    'id': user.id,
                                    'lastname': user.lastname,
                                    'username': user.username
                                }
                            }
                        };
                        $$sdkTimeline.SendEvent({
                            'entity_type': 'Discussion',
                            'entity_id': notification.event.entity_id,
                            'event': new_event,
                            'user_id': user.id,
                        }).then(function (response) {
                            notification.event.displayAnswer = false;
                            location.reload();
                        });
                    });
                };
            },
            templateUrl: '/src/retailer/notification/notification-directive.html',
            link: function(scope, elem, attrs) {
                scope.notification.icon = icon[scope.notification.event.type];
                scope.notification.color = color[scope.notification.event.type];
            }
        };
    }
]);
