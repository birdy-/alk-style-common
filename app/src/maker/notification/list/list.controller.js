'use strict';

/**
 * [description]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $$sdkCrud     [description]
 * @param  {[type]} $routeParams  [description]
 * @return {[type]}               [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerNotificationsController', [
    'permission', '$scope', '$$sdkTimeline', '$modal',
    function (permission, $scope, $$sdkTimeline, $modal) {

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
    permission.getUser().then(function(user){
        $scope.user = user;
        $$sdkTimeline.TimelineGet(user.id).then(function(response) {
            $scope.notifications = response.data.data;
            // Temporary fix for new subscribers, will be moved in the registraiton process
            if ($scope.notifications.length === 0) {
                $scope.notifications.push({
                    "event": {
                        "user_id": 1,
                        "timestamp": 1412156716,
                        "type": "PlatformBrandWelcome"
                    }
                });
            }
        });
    });
}]);
