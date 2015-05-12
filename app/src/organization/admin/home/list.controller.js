'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminHomeListController', [
    '$scope', 'permission','$$ORM', '$$sdkAuth', '$routeParams', '$location', 'ngToast', '$modal',
    function ($scope, permission, $$ORM, $$sdkAuth, $routeParams, $location, ngToast, $modal) {

    $scope.organization = {};
    $scope.organizationId = Number($routeParams.id);
    $scope.selectedSegment = null;
    $scope.newProductsLoaded = false;

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.selectSegment = function (segmentId) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segmentId).then(function (segment) {
            $scope.selectedSegment = segment;
            $$ORM.repository('ProductSegment').method('Stats')(segment.id).then(function (stats) {
                $scope.segmentDetailsLoading = false;

                if (!stats.length) { return; }
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
                currentUser: function () {
                    return $scope.currentUser;
                }

            }
        });
    };

    $scope.addUserToProductSegment = function (segment) {
        var modalInstance = $modal.open({
            templateUrl: 'src/organization/admin/productsegment/permissions/add-user-modal.html',
            controller: 'ProductSegmentAddUserModalController',
            resolve: {
                productsegment: function() { return $scope.selectedSegment; },
                organization: function() { return $scope.organization; }
            }
        });

        modalInstance.result.then(function () {
            $location.path("organization/" + $scope.organizationId + "/admin/users?segment_id=" + segment.id);
        })
    }

    $scope.createProductSegment = function () {
        if ($scope.isAdmin == false) {
            $scope.contactAdmin();
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: '/src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                productsegment_id: function () { return null; },
                organization_id: function () { return $scope.organizationId; }
            }
        });

        modalInstance.result.then(function () {
            loadSegments();
        }, function () {
        });
    };

    $scope.editProductSegment = function (segmentId) {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function() { return $scope.organizationId; },
                productsegment_id: function() { return segmentId; }
            }
        });
    };

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------

    var loadOrganization = function () {
        $$ORM.repository('Organization').get($scope.organizationId).then(function (organization) {
            $scope.organization = organization;
            loadSegments();
        });
    };


    var loadSegments = function () {
        $$ORM.repository('ProductSegment').list({organization_id: $scope.organizationId}, {}, {}, 0, 100).then(function (segments) {
            $scope.productSegments = segments;
            $scope.selectedSegment = $scope.selectSegment($scope.productSegments[0].id);

            var productSegmentRoot = Organization.getProductSegmentRoot($scope.organization);
            $scope.productSegmentRoot = productSegmentRoot;
            $$ORM.repository('ProductSegment').get(productSegmentRoot.id).then(function (segment) {
                $$ORM.repository('ProductSegment').method('Stats')(productSegmentRoot.id).then(function (stats) {
                    $scope.newProductsLoaded = true;
                    if (!stats.length) { return; }
                    var p = new Product();
                    $scope.newProductsCount = p.getNewProductsCount(stats);;
                });
            });
        });
    };

    var init = function () {
        permission.getUser().then(function (user) {
            $scope.currentUser = user;
            loadOrganization();
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
