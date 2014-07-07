'use strict';


/**
 * Modal that allows the user to register on the mailing list
 */
var SupportModalController = ['$scope', '$modalInstance', '$$sdkAuth', '$location', 'user',
                            function ($scope, $modalInstance, $$sdkAuth, $location, user) {

    $scope.supportRequest = {
        message: null,
        type: null,
        subject: null,
        origin: 1, // Dashboard Flux
        username: user.username,
        page_url: $location.protocol() + '://' + $location.host() + $location.path()
    };

    /*
     * Register a user to the mailing list
     * Default is a POST to the endpoint
     * Fallback with a GET to have the email in the logs
     */
    $scope.submit = function (supportRequest) {

        // Make a footprint in our logs #DIRTY
        $$sdkAuth.SupportRequest(supportRequest).success(function (response) {
            $modalInstance.close();
        }).error(function (response) {
            $http.get(
                'https://auth.alkemics.com/support/v1/requests',
                {
                    params: request
                }
            );
            $modalInstance.close();
        });        
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}];



angular.module('jDashboardFluxApp').controller('HeaderCtrl', [
    '$scope', 'permission', '$$sdkCrud', '$location', '$window', '$modal', '$http',
    function ($scope, permission, $$sdkCrud, $location, $window, $modal, $http) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.logged = false;
    $scope.user = null;
    $scope.brand = {};

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------
    $scope.logout = function() {
        permission.logout();            
        $scope.logged = false;
        $scope.user = null;
        $scope.brand = {};
        $location.path('/');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function() {
        permission.getUser().then(function (user) {
            $scope.logged = true;
            $scope.user = user;
            $scope.brand = user.managesBrand[0];
            $scope.brand.picture = {
                logo: 'http://assets.chefjerome.com/api/1/brand/' + $scope.brand.id + '/picture/logo/original.png',
            };
        });
    };
    init();

    var subscribe = function(){
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/home/support.html',
            controller: SupportModalController,
            resolve: {
                $http: function () {
                    return $http;
                },
                $location: function () {
                    return $location;
                },
                user: function () {
                    return $scope.user;
                }
            }
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };
    $scope.subscribe = subscribe;
}]);
