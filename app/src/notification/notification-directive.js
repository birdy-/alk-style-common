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

            'ProductClaimAccepted': 'fa-check-circle-o',
            'ProductClaimCreated': 'fa-info-circle',
            'ProductClaimErrored': 'fa-exclamation-triangle',
            'ProductClaimRefused': 'fa-times',
            'ProductCertified': 'fa-gavel',
            'ProductUpdated': 'fa-barcode',
            'ProductPictureUploaded': 'fa-picture-o',
            'ProductCommented': 'fa-comment',

            'PlatformDemoVideo': 'fa-star',
            'PlatformNewFeature': 'fa-info-circle',
            'PlatformBrandWelcome': 'fa-star',

            'Discussion': 'fa-star',

            'ProductInShopProductCertified': 'fa-gavel',
            'ProductFillReminder': 'fa-check-square-o',
            'ProductErrorReported': 'fa-warning',

            'RetailerProductAvailable': 'fa-check-circle-o',
            'RetailerProductNotAvailable': 'fa-exclamation-triangle',
            'RetailerProductPictureAsked': 'fa-info-circle',
            'RetailerProductUpdatedByMaker': 'fa-check-circle-o',
            'RetailerProductUpdatedByPhotographer': 'fa-check-circle-o',
            'RetailerProductUploadedByPhotographer': 'fa-check-circle-o',

            'MakerProductClaimByRetailer': 'fa-info-circle',
            'MakerProductTechnicalValidation': 'fa-info-circle',
            'MakerProductArtisticValidation': 'fa-check-circle-o',
            'MakerProductArtisticClaim': 'fa-info-circle',
            'MakerProductValidation': 'fa-check-circle-o',

            'PhotographerProductValidation': 'fa-info-circle',
            'PhotographerProductPictureClaim': 'fa-info-circle'
        };
        var color = {
            'BrandClaimAccepted': 'color-green-inverse',
            'BrandClaimCreated': 'color-blue-inverse',
            'BrandClaimErrored': 'color-orange-inverse',
            'BrandClaimRefused': 'color-error-inverse',

            'ProductClaimAccepted': 'color-green-inverse',
            'ProductClaimCreated': 'color-blue-inverse',
            'ProductClaimErrored': 'color-orange-inverse',
            'ProductClaimRefused': 'color-error-inverse',
            'ProductCertified': 'color-green-inverse',
            'ProductUpdated': 'color-green-inverse',
            'ProductPictureUploaded': 'color-yellow-inverse',
            'ProductCommented': 'color-blue-inverse',

            'PlatformDemoVideo': 'color-purple-inverse',
            'PlatformNewFeature': 'color-purple-inverse',
            'PlatformBrandWelcome': 'color-purple-inverse',

            'Discussion': 'color-green-inverse',

            'ProductInShopProductCertified': 'color-green-inverse',
            'ProductFillReminder': 'color-yellow-inverse',
            'ProductErrorReported': 'color-red-inverse',

            'RetailerProductAvailable': 'color-green-inverse',
            'RetailerProductNotAvailable': 'color-yellow-inverse',
            'RetailerProductPictureAsked': 'color-blue-inverse',
            'RetailerProductUpdatedByMaker': 'color-green-inverse',
            'RetailerProductUpdatedByPhotographer': 'color-green-inverse',
            'RetailerProductUploadedByPhotographer': 'color-green-inverse',

            'MakerProductClaimByRetailer': 'color-orange-inverse',
            'MakerProductTechnicalValidation': 'color-blue-inverse',
            'MakerProductArtisticValidation': 'color-green-inverse',
            'MakerProductArtisticClaim': 'color-orange-inverse',
            'MakerProductValidation': 'color-green-inverse',

            'PhotographerProductValidation': 'color-blue-inverse',
            'PhotographerProductPictureClaim': 'color-blue-inverse'
        };

        return {
            restrict: 'AEC',
            scope: {
                notification: '=alkNotification'
            },
            controller: [
                '$scope', '$$sdkTimeline', 'permission', 'ngToast',
                function ($scope, $$sdkTimeline, permission, ngToast) {

                    var makerUserId = 842;
                    var retailerUserId = 857;
                    var photographerUserId = 891;

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

                    $scope.claimPictureToRetailer = function (notification) {
                        permission.getUser().then(function (user) {
                            // Warn the retailer
                            var newEvent = {
                                entity_type: 'RetailerProductPictureAsked',
                                timestamp: moment().unix(),
                                type: 'RetailerProductPictureAsked',
                                data: notification.event.data
                            };

                            $$sdkTimeline.SendEvent({
                                entity_id: moment().unix(),
                                entity_type: 'RetailerProductPictureAsked',
                                user_id: retailerUserId,
                                event: newEvent
                            }).then(function (response) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Votre message a bien été envoyé.'
                                });
                            });

                            // Ask more info to maker
                            var newEvent = {
                                entity_type: 'MakerProductArtisticClaim',
                                timestamp: moment().unix(),
                                type: 'MakerProductArtisticClaim',
                                data: notification.event.data
                            };

                            $$sdkTimeline.SendEvent({
                                entity_id: moment().unix(),
                                entity_type: 'MakerProductArtisticClaim',
                                user_id: makerUserId,
                                event: newEvent
                            }).then(function (response) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Votre message a bien été envoyé.'
                                });
                            });
                        });

                        $scope.warnPhotographerProductSent(notification);
                    };

                    $scope.warnPhotographerProductSent = function (notification) {
                        // Warn photographer
                        var newEvent = {
                            entity_type: 'PhotographerProductPictureClaim',
                            timestamp: moment().unix(),
                            type: 'PhotographerProductPictureClaim',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'PhotographerProductPictureClaim',
                            user_id: photographerUserId,
                            event: newEvent
                        }).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Votre message a bien été envoyé.'
                            });
                        });
                    };

                    $scope.validatePictureArtistic = function (notification) {
                        permission.getUser().then(function (user) {
                            var newEvent = {
                                entity_type: 'MakerProductArtisticValidation',
                                timestamp: moment().unix(),
                                type: 'MakerProductArtisticValidation',
                                data: notification.event.data
                            };

                            $$sdkTimeline.SendEvent({
                                entity_id: moment().unix(),
                                entity_type: 'MakerProductArtisticValidation',
                                user_id: makerUserId,
                                event: newEvent
                            }).then(function (response) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Votre message a bien été envoyé.'
                                });
                            });

                            var newEvent = {
                                entity_type: 'RetailerProductUpdatedByMaker',
                                timestamp: moment().unix(),
                                type: 'RetailerProductUpdatedByMaker',
                                data: notification.event.data
                            };

                            $$sdkTimeline.SendEvent({
                                entity_id: moment().unix(),
                                entity_type: 'RetailerProductUpdatedByMaker',
                                user_id: retailerUserId,
                                event: newEvent
                            }).then(function (response) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Votre message a bien été envoyé.'
                                });
                            });
                        });
                    };

                    $scope.rejectPictureArtistic = function (notification) {
                        $scope.claimPictureToRetailer(notification);
                    };

                    $scope.chaseProductInformation = function (notification) {
                        permission.getUser().then(function (user) {
                            var newEvent = {
                                entity_type: 'MakerProductClaimByRetailer',
                                timestamp: moment().unix(),
                                type: 'MakerProductClaimByRetailer',
                                data: notification.event.data
                            };

                            $$sdkTimeline.SendEvent({
                                entity_id: moment().unix(),
                                entity_type: 'MakerProductClaimByRetailer',
                                user_id: makerUserId,
                                event: newEvent
                            }).then(function (response) {
                                ngToast.create({
                                    className: 'success',
                                    content: 'Votre message a bien été envoyé.'
                                });
                            });
                        });
                    };

                    $scope.chaseProductReception = function (notification) {
                        // Ask more info to maker
                        var newEvent = {
                            entity_type: 'MakerProductArtisticClaim',
                            timestamp: moment().unix(),
                            type: 'MakerProductArtisticClaim',
                            data: notification.event.data
                        };

                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductArtisticClaim',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Votre message a bien été envoyé.'
                            });
                        });
                    };
                }
            ],
            templateUrl: '/src/notification/notification-directive.html',
            link: function(scope, elem, attrs) {
                scope.notification.icon = icon[scope.notification.event.type];
                scope.notification.color = color[scope.notification.event.type];
            }
        };
    }
]);
