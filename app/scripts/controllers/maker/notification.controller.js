'use strict';

/**
 * Homepage for a Maker.
 *
 * @param  {[type]} $scope      [description]
 * @param  {[type]} $$sdkCrud   [description]
 * @param  {[type]} permission) [description]
 * @return {[type]}             [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerNotificationsCtrl', [
    '$scope', '$$sdkCrud', 'permission',
    function ($scope, $$sdkCrud, permission) {

    $scope.notifications = [];

    permission.getUser().then(function (user) {
        $scope.brand = user.ownsBrand[0];
        $$sdkCrud.BrandShow($scope.brand.id, function(response){
            $scope.brand = response.data;
        });
        $$sdkCrud.BrandNotificationList({}, {brand_id: $scope.brand.id}).success(function(response){
            var notifications = response.data;
            var icons = {
                0: '',
                10: 'info',
                20: 'check',
                30: 'warning',
                40: 'warning', //'error',
                50: 'critical',
            };
            var levels = {
                0: '',
                10: 'info',
                20: 'success',
                30: 'warning',
                40: 'danger', //'error',
                50: 'critical',
            };
            var subjects = {
                1: "Rapport d'erreur",
                2: "Nouveau champ disponible",
                0: "Produit crée",
                3: "Produit modifé",
                7: "Produit accepté",
                6: "Produit certifié",
                4: "Import réussi",
                5: "Nouveau produit attribué",
            };
            angular.forEach(notifications, function(notification){
                notification.levelName = levels[notification.level];
                notification.iconName = icons[notification.level];
                notification.subjectName = subjects[notification.subject];
            });
            $scope.notifications = notifications;
        });
    });
}]);