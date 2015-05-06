'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminHomeListController', [
    '$scope', 'permission','$$ORM', '$$sdkAuth', '$routeParams', '$location', 'ngToast', '$modal',
    function ($scope, permission, $$ORM, $$sdkAuth, $routeParams, $location, ngToast, $modal) {

    $scope.organization = {};
    $scope.selectedSegment = null;

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.selectSegment = function (segment) {
        $$ORM.repository('ProductSegment').get(segment.id).then(function (segment) {
            $scope.selectedSegment = segment;
            $$ORM.repository('ProductSegment').method('Stats')(segment.id).then(function (stats) {
                $scope.selectedSegment.stats = stats[0];
                $scope.selectedSegment.stats.certifieds = stats[0].counts[Product.CERTIFICATION_STATUS_CERTIFIED.id];
                $scope.selectedSegment.stats.notCertifieds = stats[0].counts[Product.CERTIFICATION_STATUS_ACCEPTED.id];
                $scope.selectedSegment.stats.archived = stats[0].counts[Product.CERTIFICATION_STATUS_DISCONTINUED.id];
            });
        });
    };

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
        loadSegments();
    });

    var loadSegments = function () {
        var productSegmentIds = $scope.organization.ownsProductSegment.map(function (productSegment) {
            return productSegment.id;
        });
        $$ORM.repository('ProductSegment').list({organization_id: $scope.organizationId}, {filter_id_in: productSegmentIds}, {}, 0, 100).then(function (segments) {
            $scope.productSegments = segments;
        });
    };

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
