'use strict';

/**
 * Homepage for a Maker.
 *
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $$sdkCrud   [description]
 * @param  {[type]} permission) [description]
 * @return {[type]}             [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerNotificationsController', [
    '$scope', '$$sdkCrud', 'permission',
    function ($scope, $$sdkCrud, permission) {

    $scope.notifications = [];
    $scope.brand = {};

    var loadNotifications = function() {
        $$sdkCrud.BrandNotificationList({}, {brand_id: $scope.brand.id}).success(function(response){
            var notification;
            for (var i = 0; i < response.data.length; i++) {
                notification = new Notification();
                notification.fromJson(response.data[i]);
                $scope.notifications.push(notification);
            }
        });
    };
    var load = function (user) {
        $scope.brand = user.managesBrand[0];
        $$sdkCrud.BrandShow($scope.brand.id).success(function(response){
            $scope.brand = response.data;
        });
        loadNotifications();
    };

    permission.getUser().then(load);
}]);