'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminHomeListController', [
    '$scope', 'permission','$$ORM', '$$sdkCrud','$$sdkAuth', '$routeParams', '$location', 'ngToast', '$modal', '$analytics',
    function ($scope, permission, $$ORM, $$sdkCrud, $$sdkAuth, $routeParams, $location, ngToast, $modal, $analytics) {

    $scope.organization = {};
    $scope.organizationId = Number($routeParams.id);
    $scope.selectedSegment = null;
    $scope.newProductsLoaded = false;

    $scope.rmComfirmMsg = "Etes vous sûr de vouloir supprimer se segment ?"

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.selectSegment = function (segmentId) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segmentId).then(function (segment) {
            $scope.selectedSegment = segment;
            $scope.segmentDetailsLoading = false;
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
            $analytics.eventTrack('MAK Admin AddProductSegment Success');
            $location.path("organization/" + $scope.organizationId + "/admin/permissions/productsegment?segment_id=" + segment.id);
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

    $scope.deleteProductSegment = function () {
        $$ORM.repository('ProductSegment').method('Delete')($scope.selectedSegment.id, $scope.organizationId).then(function (response) {
            loadSegments();
        });
    };

    $scope.toggleSearchDisplay = function () {
        // set focus on search
        $scope.displaySearch = !$scope.displaySearch;
        return;
    }

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
        var query = {
            organization_id: $scope.organizationId,
            withPermissions: 1
        };

        $$ORM.repository('ProductSegment').list(query, {}, {}, 0, 100).then(function (segments) {
            $scope.segments = segments;
            $scope.selectedSegment = $scope.selectSegment($scope.segments[0].id);

            var productSegmentRoot = Organization.getProductSegmentRoot($scope.organization);
            $scope.productSegmentRoot = productSegmentRoot;
            $$ORM.repository('ProductSegment').get(productSegmentRoot.id).then(function (segment) {
              var filters = {
                productsegment_id: productSegmentRoot.id,
                certified: Product.CERTIFICATION_STATUS_ATTRIBUTED.id
              };
              // Getting the product list with new product-style filters, and limit of 0 (need count only)
              // Done to enforce the consistency of the count and the actual product list
              $$sdkCrud.ProductList({}, filters, {}, 0, 0, {}).success(function (response) {
                $scope.newProductsCount = response.totalResults;
                $scope.newProductsLoaded = true;
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
}])

.directive('focusMe', function ($timeout) {
  return {
    link: function($scope, $element, $attrs) {
        $scope.$watch($attrs.focusMe, function (value) {
            if(value === true) {
                $element[0].focus();
            }
        });

        $element.bind('blur', function () {
            if (!$scope.search) {
                $scope.search = {};
            }
            if (!$scope.filteredSegments.length || !$scope.search.$) {
                $scope.search.$ = '';
                $scope[$attrs.focusMe] = false;
                $scope.$apply();
            }
        });
    }
  };
});
