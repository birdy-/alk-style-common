'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardRetailerNotificationListController', [
    'permission', '$scope', '$$sdkTimeline',
    function (permission, $scope, $$sdkTimeline) {

        $scope.notifications = [];

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        permission.getUser().then(function (user) {
            $$sdkTimeline.TimelineGet(user.id).then(function (response) {
                $scope.notifications = $scope.notifications.concat(response.data.data);

                if (+user.id !== 10 && +user.id !== 857) { return; }

                // POC Carrefour
                $scope.notifications.push({
                    'event': {
                        timestamp: 1432539300,
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
                    }
                });
                $scope.notifications.push({
                    event: {
                        timestamp: 1432539321,
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
                    }
                });
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

