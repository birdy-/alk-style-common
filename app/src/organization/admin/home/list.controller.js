'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminHomeListController', [
    '$scope', 'permission','$$ORM', '$$sdkAuth', '$routeParams', '$location', 'ngToast', '$modal',
    function ($scope, permission, $$ORM, $$sdkAuth, $routeParams, $location, ngToast, $modal) {

    $scope.organization = {};

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.addUser = function () {
        if ($scope.isAdmin == false) {
            $scope.contactAdmin();
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/add.html',
            controller: 'OrganizationUserAddController',
            resolve: {
                organization: function () {
                    return $scope.organization;
                },
                brands: function () {
                    return [];
                },
                currentUser: function() {
                    return $scope.currentUser;
                }

            }
        });

        modalInstance.result.then(function () {
            //loadUsers();
        }, function () {
        });
    };
    $scope.addSegment = function () {
        if ($scope.isAdmin == false) {
            $scope.contactAdmin();
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function() { return $scope.organizationId; }
            }
        });

        modalInstance.result.then(function () {
            loadSegments();
        }, function () {
        });
    }
    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------
    $scope.organizationId = Number($routeParams.id);
    $$ORM.repository('Organization').get($scope.organizationId).then(function (entity) {
        $scope.organization = entity;
    });
    $$ORM.repository('ProductSegment').list({organization_id: $scope.organizationId}, {}, {}, 0, 100).then(function (segments) {
        $scope.productSegments = segments;
    });


    var init = function () {
        permission.getUser().then(function(user) {
            $scope.currentUser = user;
            if (!permission.isAdmin($scope.organizationId)) {
                ngToast.create({
                    className: 'danger',
                    content: "Vous n'êtes pas administrateur pour cette organisation !",
                    timeout: 3000
                });
                $location.path("/user/me/profile");
            }
        });
    };
    init();
}]);
