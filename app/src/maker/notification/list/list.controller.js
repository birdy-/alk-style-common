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
        $$sdkTimeline.TimelineGet(user.id).then(function (response) {
            $scope.notifications = response.data.data;

            // Temporary fix for new subscribers, will be moved in the registraiton process
            $$sdkAuth.UserClaimProductBrandList().then(function (response) {
                var claimEvents = response.data.data;
                var claims = [
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

                claimEvents.forEach(function (claimEvent) {
                    var claim = claims[claimEvent.status];
                    $scope.notifications.push({
                        'event': {
                            'user_id': user.id,
                            'timestamp': moment(claimEvent.updatedAt).unix(),
                            'brandName': claimEvent.value,
                            'type': claim.status
                        }
                    });
                });
                var claim = claims[2];
                $scope.notifications.push({
                    'event': {
                        'user_id': user.id,
                        'timestamp': moment().unix(),
                        'brandName': 'Test fail',
                        'type': claim.status
                    }
                });
                var claim = claims[1];
                $scope.notifications.push({
                    'event': {
                        'user_id': user.id,
                        'timestamp': moment().unix(),
                        'brandName': 'Test success',
                        'type': claim.status
                    }
                });
                var claim = claims[3];
                $scope.notifications.push({
                    'event': {
                        'user_id': user.id,
                        'timestamp': moment().unix(),
                        'brandName': 'Test error',
                        'type': claim.status
                    }
                });

                $scope.notifications.sort(function (a, b) { return b.event.timestamp - a.event.timestamp });
                // Temporary fix for new subscribers, will be moved in the registraiton process
                $scope.notifications.push({
                    'event': {
                        'user_id': 1,
                        'timestamp': 1412156716,
                        'type': 'PlatformBrandWelcome'
                    }
                });
            });
        });
    });
}]);
