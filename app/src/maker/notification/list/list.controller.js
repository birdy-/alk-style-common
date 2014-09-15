'use strict';

/**
 * Displays all the notifications that a User has received.
 *
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerNotificationsController', [
    '$scope', '$$sdkCrud', 'permission',
    function ($scope, $$sdkCrud, permission) {

    $scope.notifications = [];
    $scope.brand = {};

    var loadNotifications = function() {
        $$sdkCrud.BrandNotificationList({}, {brand_id: $scope.brand.id}).success(function(response){
            $scope.notifications = response.data.forEach(function(json){
                var notification = new Notification();
                notification.fromJson(json);
                return notification;
            });
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