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
angular.module('jDashboardFluxApp').controller('DashboardMakerGetStartedCtrl', [
    '$scope', '$$sdkCrud', '$routeParams', 'permission',
    function ($scope, $$sdkCrud, $routeParams, permission) {

    $scope.showConfirm = false;
    $scope.brands = [
        {id: 1, name:'Coca-Cola', accepted: null},
        {id: 2, name:'Schweppes', accepted: null},
    ];
    $scope.brand = $scope.brands[0];

    $scope.confirm = function(){
        $scope.showConfirm = true;
    };
    $scope.accept = function(brand) {
        $scope.showConfirm = false;
        brand.accepted = true;
        // Update authorization
        $scope.next();
    };
    $scope.refuse = function(brand) {
        $scope.showConfirm = false;
        brand.accepted = false;
        // Update authorization
        $scope.next();
    };
    $scope.next = function(brand) {
        $scope.brands.remove($scope.brand);
        if ($scope.brands.length) {
            $scope.brand = $scope.brands[0];
        } else {

        }
    };

    permission.getUser().then(function (user) {
        $scope.brands = user.managesBrand;
    });
}]);
