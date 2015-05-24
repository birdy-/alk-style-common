'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerNotificationsController', [
    'permission', '$scope', '$$sdkTimeline', '$modal', '$$sdkAuth',
    function (permission, $scope, $$sdkTimeline, $modal, $$sdkAuth) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.notifications = [];
    $scope.user = null;

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    permission.getUser().then(function (user) {
        $scope.user = user;
        var brands = user.managesBrand;

        $$sdkTimeline.TimelineGet(user.id).then(function (response) {
            $scope.notifications = response.data.data;

            $scope.notifications.map(function (notification) {
                if (notification.event.type == 'Discussion') {
                    notification.event.answer = '';
                    notification.event.displayAnswer = false;
                }
            });

            // Temporary fix for new subscribers, will be moved in the registraiton process
            $$sdkAuth.UserClaimProductBrandList().then(function (response) {
                var brandClaimEvents = response.data.data;
                var brandClaims = [
                    {
                        'status': 'BrandClaimCreated'
                    },
                    {
                        'status': 'BrandClaimAccepted'
                    },
                    {
                        'status': 'BrandClaimRefused'
                    },
                    {
                        'status': 'BrandClaimErrored'
                    }
                ];

                brandClaimEvents.forEach(function (claimEvent) {
                    var claim = brandClaims[claimEvent.status];
                    $scope.notifications.push({
                        'event': {
                            'user_id': user.id,
                            'timestamp': moment(claimEvent.updatedAt).unix(),
                            'brandName': claimEvent.value,
                            'type': claim.status
                        }
                    });
                });

                user.managesBrand.forEach(function (brand) {
                    var filters = {
                        'brandId': brand.id
                    };
                    $$sdkAuth.UserClaimProductReferenceList({}, filters).then(function (response) {
                        var productClaimEvents = response.data.data;

                        productClaimEvents.forEach(function (claimEvent) {
                            var claim = new UserClaimProductReference();

                            $scope.notifications.push({
                                'event': claim.fromJson(claimEvent)
                            });
                        });
                    });
                });

                // Temporary fix for new subscribers, will be moved in the registraiton process
                $scope.notifications.push({
                    'event': {
                        'user_id': 1,
                        'timestamp': 1412156716,
                        'type': 'PlatformBrandWelcome'
                    }
                });

                // Temporary fix, will be moved in the timeline process
                $scope.notifications.push({
                    'event': {
                        'timestamp': moment().unix(),
                        'type': 'PlatformDemoVideo'
                    }
                });


                // POC Carrefour
                $scope.notifications.push({
                    event: {
                        timestamp: moment().unix(),
                        type: 'MakerProductClaimByRetailer',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    }
                });
                $scope.notifications.push({
                    event: {
                        timestamp: moment().unix(),
                        type: 'MakerProductTechnicalValidation',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    }
                });
                $scope.notifications.push({
                    event: {
                        timestamp: moment().unix(),
                        type: 'MakerProductArtisticValidation',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    }
                });
                $scope.notifications.push({
                    event: {
                        timestamp: moment().unix(),
                        type: 'MakerProductArtisticClaim',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    }
                });
                $scope.notifications.push({
                    event: {
                        timestamp: moment().unix(),
                        type: 'MakerProductValidation',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    }
                });
            });
        });
    });
}]);
