'use strict';

/**
 * Controller for the Login form. For protection reasons, the login form is always
 * displayed at startup, and disappears once permissions have loaded. See the
 * authenticate directive for that matter.
 */
angular.module('jDashboardFluxApp').controller('LoginController', [
    '$scope', 'permission', '$location',
     function ($scope, permission, $location) {

    $scope.login = null;
    $scope.password = null;
    $scope.message = null;

    /**
     * Function called when user validates credentials
     *
     */
    $scope.submit = function() {

        permission.login($scope.login, $scope.password)
        .error(function(response, status, headers, config){
            $scope.message = response.message || response.error_description || "Erreur lors de l'authentification.";
        })
        .success(function(response){
            $location.path('/prehome');
        });
    };

}]);

angular.module('jDashboardFluxApp').controller('PreHomeController', [
    '$scope', 'permission', '$location',
    function ($scope, permission, $location) {
    $scope.shop_ids = [];
    $scope.brand_ids = [];

    $scope.dashboardRetailer = false;
    $scope.dashboardProduct = false;
    $scope.nodashboard = true;

    permission.getUser().then(function(user){
            $scope.shop_ids = user.managesShop.map(function(shop){
                $scope.nodashboard = false;
                return shop.id;
            });
            $scope.brand_ids = user.managesBrand.map(function(brand){
                $scope.nodashboard = false;
                return brand.id;
            });
            if ($scope.shop_ids.length > 0)
                $scope.dashboardRetailer = true;
            if ($scope.brand_ids.length > 0)
                $scope.dashboardProduct = true;
            if ($scope.dashboardProduct == false &&
                $scope.dashboardRetailer == true)
                 $location.path('/retailer');
            else if ($scope.dashboardProduct == true &&
                $scope.dashboardRetailer == false)
                 $location.path('/maker/brand/all/product');
    });

}]);