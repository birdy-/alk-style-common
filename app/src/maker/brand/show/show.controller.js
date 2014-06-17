'use strict';

/**
 * Page that displays all the elements that describe a given Brand.
 *
 * @param  {[type]} $scope       [description]
 * @param  {[type]} $$sdkCrud    [description]
 * @param  {[type]} $routeParams [description]
 * @param  {[type]} permission)  [description]
 * @return {[type]}              [description]
 */
angular.module('jDashboardFluxApp').controller('DashboardMakerBrandShowCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', 'permission',
    function ($scope, $$sdkCrud, $routeParams, permission) {

    $scope.brand = null;

    permission.getUser().then(function (user) {
        $scope.brand = user.managesBrand[0];
        $$sdkCrud.BrandShow($scope.brand.id, function(response){
            $scope.brand = response.data;
        });
    });

    $scope.submit = function() {
        alert('You do not have the necessary privileges to update this brand.');
    };
}]);