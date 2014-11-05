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
            $scope.notifications = response.data.data;
        });
    });
}]);

