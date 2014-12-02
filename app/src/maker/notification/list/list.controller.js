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
                    $$sdkAuth.UserClaimProductReferenceList(brand.id).then(function (response) {
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
            });
        });
    });
}]);
