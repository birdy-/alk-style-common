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
    '$scope', '$$sdkCrud', '$routeParams', 'permission', '$location',
    function ($scope, $$sdkCrud, $routeParams, permission, $location) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.brand = {};
    $scope.brandForm;


    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.save = function(){
        $scope.brandForm.$saving = true;
        $$sdkCrud.BrandUpdate($scope.brand).success(function(response){
            $scope.brand = response.data;
            $scope.brandForm.$saving = false;
            $scope.brandForm.$setPristine();
        }).error(function(response){
            alert(response);
        });
    };

    $scope.status = function() {
        if($scope.brandForm.$pristine) {
            return ['ng-pristine'];
        }
        return ['ng-dirty'];
    };
    $scope.formInit = function(form) {
        form.$loading = true;
        form.$saving = false;
    };


    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var load = function() {
        $$sdkCrud.BrandShow($routeParams.id, function(response){
            $scope.brand = response.data;
            $scope.brandForm.$loading = false;
        });
    };
    var init = function() {
        permission.getUser().then(function(user){
            if (!user.isAllowed('Brand', parseInt($routeParams.id))) {
                alert("Vous n'êtes pas autorisé à consulter cette page.");
                $location.path('/maker/brand');
                return;
            }
            load();
        });
    };
    init();
}]);