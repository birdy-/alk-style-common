'use strict';

angular.module('jDashboardFluxApp').controller('MakerFaqController', [
    '$scope', '$modal', 'permission',
    function ($scope, $modal, permission) {

        // ------------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------------
        $scope.logged = false;
        $scope.user = {};

        // ------------------------------------------------------------------------
        // Event handling
        // ------------------------------------------------------------------------

        $scope.subscribe = function (message) {
            var modalInstance = $modal.open({
                templateUrl: '/src/home/contact.html',
                controller: 'ContactController',
                resolve: {
                    user: function () {
                        return $scope.user;
                    },
                    message: function () {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        };

        // ------------------------------------------------------------------------
        // Init
        // ------------------------------------------------------------------------
        var init = function () {
            permission.getUser().then(function (user) {
                $scope.logged = true;
                $scope.user = user;
            });
        };
        init();
    }
]);
