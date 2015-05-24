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
        permission.getUser().then(function(user){
            $$sdkTimeline.TimelineGet(user.id).then(function(response) {
                $scope.notifications = $scope.notifications.concat(response.data.data);
            });
        });

        // POC Carrefour
        $scope.notifications.push({
            'event': {
                timestamp: moment().unix(),
                type: 'RetailerProductAvailable',
                data: {
                    claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
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
                timestamp: moment().unix(),
                type: 'RetailerProductNotAvailable',
                data: {
                    claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                    product: {
                        reference: '3663215010508',
                        name: 'Smoothie Orange Bio 1L',
                        manufacturerName: 'Alkemics Brand',
                        photographerName: 'ProductPhoto'
                    }
                }
            }
        });
        $scope.notifications.push({
            event: {
                timestamp: moment().unix(),
                type: 'RetailerProductPictureAsked',
                data: {
                    claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
                    product: {
                        reference: '3663215010508',
                        name: 'Smoothie Orange Bio 1L',
                        manufacturerName: 'Alkemics Brand',
                        photographerName: 'ProductPhoto'
                    }
                }
            }
        });
        $scope.notifications.push({
            event: {
                timestamp: moment().unix(),
                type: 'RetailerProductUpdatedByMaker',
                data: {
                    claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
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
                timestamp: moment().unix(),
                type: 'RetailerProductUpdatedByPhotographer',
                data: {
                    claimDate: moment().set({'year': 2015, 'month': 5, 'day': 4}).format('DD MMM YYYY'),
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
    }
]);

