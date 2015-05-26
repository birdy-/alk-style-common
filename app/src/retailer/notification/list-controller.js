'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerNotificationListController', [
    'permission', '$scope', '$$sdkTimeline', '$window',
    function (permission, $scope, $$sdkTimeline, $window) {

        $scope.notifications = [];
        $scope.displayDemo = false;
        var makerUserId = 842;
        var retailerUserId = 857;
        var photographerUserId = 891;

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------

        $scope.startDemo = function (caseNumber) {
            var user = $scope.user;
            if (+user.id !== 10 &&
                +user.id !== makerUserId &&
                +user.id !== retailerUserId &&
                +user.id !== photographerUserId
            ) { return; }

            switch (caseNumber) {
                case 1:
                    var newEvent = {
                        timestamp: moment().unix(),
                        type: 'RetailerProductAvailable',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 4, 'date': 27}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto',
                                    address: '8 rue du Sentier, 75002 Paris'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                manufacturerName: 'Alkemics Brand',
                                photographerName: 'ProductPhoto',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    };
                    $$sdkTimeline.SendEvent({
                        entity_id: moment().unix(),
                        entity_type: 'RetailerProductAvailable',
                        user_id: retailerUserId,
                        event: newEvent
                    }).then(function (response) {
                        newEvent.type = 'MakerProductClaimByRetailerOk';
                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductClaimByRetailerOk',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            $window.location.reload();
                        });
                    });


                    break;
                case 2:

                    var newEvent = {
                        timestamp: moment().unix(),
                        type: 'RetailerProductNotAvailable',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 4, 'date': 27}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto',
                                    address: '8 rue du Sentier, 75002 Paris'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                manufacturerName: 'Alkemics Brand',
                                photographerName: 'ProductPhoto',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    };

                    $$sdkTimeline.SendEvent({
                        entity_id: moment().unix(),
                        entity_type: 'RetailerProductNotAvailable',
                        user_id: retailerUserId,
                        event: newEvent
                    }).then(function (response) {
                        newEvent.type = 'MakerProductClaimByRetailer';
                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductClaimByRetailer',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            $window.location.reload();
                        });
                    });

                    break;
                case 3:

                    var newEvent = {
                        timestamp: moment().unix(),
                        type: 'RetailerProductNotAvailable',
                        data: {
                            claimDate: moment().set({'year': 2015, 'month': 4, 'date': 27}).format('DD MMM YYYY'),
                            claimer: {
                                name: 'Carrefour',
                                photographer: {
                                    name: 'ProductPhoto',
                                    address: '8 rue du Sentier, 75002 Paris'
                                }
                            },
                            product: {
                                reference: '3663215010508',
                                name: 'Smoothie Orange Bio 1L',
                                manufacturerName: 'Alkemics Brand',
                                photographerName: 'ProductPhoto',
                                urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                            }
                        }
                    };

                    $$sdkTimeline.SendEvent({
                        entity_id: moment().unix(),
                        entity_type: 'RetailerProductNotAvailable',
                        user_id: retailerUserId,
                        event: newEvent
                    }).then(function (response) {
                        newEvent.type = 'MakerProductClaimByRetailer';
                        $$sdkTimeline.SendEvent({
                            entity_id: moment().unix(),
                            entity_type: 'MakerProductClaimByRetailer',
                            user_id: makerUserId,
                            event: newEvent
                        }).then(function (response) {
                            $window.location.reload();
                        });
                    });
                    break;
                default:
                    break;
            }
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function (user) {
            $scope.user = user;
            console.log(user);
            console.log(retailerUserId);
            $scope.displayDemo = (+user.id === 10 || +user.id === retailerUserId);

            $$sdkTimeline.TimelineGet(user.id).then(function (response) {
                $scope.notifications = $scope.notifications.concat(response.data.data);


                // $scope.notifications.push({
                //     event: {
                //         timestamp: moment().unix(),
                //         type: 'RetailerProductPictureAsked',
                //         data: {
                //             claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                //             product: {
                //                 reference: '3663215010508',
                //                 name: 'Smoothie Orange Bio 1L',
                //                 manufacturerName: 'Alkemics Brand',
                //                 photographerName: 'ProductPhoto'
                //             }
                //         }
                //     }
                // });
                // $scope.notifications.push({
                //     event: {
                //         timestamp: moment().unix(),
                //         type: 'RetailerProductUpdatedByMaker',
                //         data: {
                //             claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                //             product: {
                //                 reference: '3663215010508',
                //                 name: 'Smoothie Orange Bio 1L',
                //                 manufacturerName: 'Alkemics Brand',
                //                 photographerName: 'ProductPhoto',
                //                 urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                //             }
                //         }
                //     }
                // });
                // $scope.notifications.push({
                //     event: {
                //         timestamp: moment().unix(),
                //         type: 'RetailerProductUpdatedByPhotographer',
                //         data: {
                //             claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                //             product: {
                //                 reference: '3663215010508',
                //                 name: 'Smoothie Orange Bio 1L',
                //                 manufacturerName: 'Alkemics Brand',
                //                 photographerName: 'ProductPhoto',
                //                 urlPicture: 'https://smedia.alkemics.com/product/387085/picture/packshot/256x256.png'
                //             }
                //         }
                //     }
                // });
            });
        });
    }
]);

