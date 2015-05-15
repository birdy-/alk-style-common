'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminProductSegmentPermissionsController', [
    '$scope', '$q', 'permission','$routeParams', '$location', '$modal', '$$ORM', '$window', '$$sdkAuth', '$$sdkCrud',
    function ($scope, $q, permission, $routeParams, $location, $modal, $$ORM, $window, $$sdkAuth, $$sdkCrud) {

    $scope.organizationId = $routeParams.id;
    $scope.currentUser = null;
    $scope.segments = [];
    $scope.users = [];
    $scope.organization = null;
    $scope.isLoading = false;


    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    $scope.goHome = function() {
        $location.path($location.url($location.path('/')));
    };

    $scope.createProductSegment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function() { return $scope.organizationId; },
                productsegment_id: function() { return null; }
            }
        });
    };

    $scope.editProductSegment = function (segmentId) {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function () { return $scope.organizationId; },
                productsegment_id: function () { return segmentId; }
            }
        });
    };

    // $scope.inviteUser = function () {
    //     var modalInstance = $modal.open({
    //         templateUrl: '/src/organization/user/add.html',
    //         controller: 'OrganizationUserAddController',
    //         resolve: {
    //             organization:   function () { return $scope.organization; },
    //             brands:         function () { return null; },
    //             currentUser:    function () { return $scope.currentUser; }
    //         }
    //     });
    // };

    var getUsersFromSegment = function (segment) {
        var users = [];
        var allowedUserIds = [];
        for (var key in segment.permissions) {
            Array.prototype.push.apply(allowedUserIds, segment.permissions[key]);
        }
        allowedUserIds = _.uniq(allowedUserIds);

        for (var i = 0; i < allowedUserIds.length; i++) {
            users.push(_.find($scope.users, { id: allowedUserIds[i] }));
        }
        console.log(users);
        return users;
     };

    $scope.selectSegment = function (segmentId) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segmentId, { 'with_permissions':true }).then(function (segment) {
            $scope.selectedSegment = segment;

            segment.users = getUsersFromSegment(segment);

            $$ORM.repository('ProductSegment').method('Stats')(segment.id).then(function (stats) {
                $scope.segmentDetailsLoading = false;

                if (!stats.length) { return; }
                $scope.selectedSegment.stats = stats[0];
                $scope.selectedSegment.stats.certifieds = stats[0].counts[Product.CERTIFICATION_STATUS_CERTIFIED.id];
                $scope.selectedSegment.stats.notCertifieds = stats[0].counts[Product.CERTIFICATION_STATUS_ACCEPTED.id];
                $scope.selectedSegment.stats.archived = stats[0].counts[Product.CERTIFICATION_STATUS_DISCONTINUED.id];
                $scope.selectedSegment.stats.total = $scope.selectedSegment.stats.certifieds + $scope.selectedSegment.stats.notCertifieds;
            });
        });
    };

    $scope.addUser = function (segment) {
        $modal.open({
            templateUrl: 'src/organization/admin/productsegment/permissions/add-user-modal.html',
            controller: 'ProductSegmentAddUserModalController',
            resolve: {
                productsegment: function() { return $scope.selectedSegment; },
                organization: function() { return $scope.organization; }
            }
        }).result.then(function () {
            $scope.selectSegment($scope.selectedSegment.id);
        });
    }

    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------

    var getProductSegments = function () {
        return $$sdkCrud.ProductSegmentList({'organization_id':$scope.organizationId}, {}, {}, null, null);
    };

    var getOrganization = function () {
        return $$sdkAuth.OrganizationShow($scope.organizationId);
    };

    var getOrganizationUsers = function () {
        return $$sdkAuth.OrganizationUsers($scope.organizationId);
    }

    var getCurrentUser = function() {
        return permission.getUser();
    };

    var initScope = function (currentUser, users, organization, productSegments) {
        users = users.data.data;
        organization = organization.data.data;
        productSegments = productSegments.data.data;

        var userObjects = [];
        for (var i = 0; i < users.length; i++) {
            userObjects.push(new User(users[i]));
        }

        var defaultSegmentId = $routeParams.segment_id || productSegments[0].id;
        $scope.selectSegment(defaultSegmentId);

        $scope.isLoading = false;
        $scope.currentUser = currentUser;
        $scope.users = userObjects;
        $scope.organization = organization;
        $scope.productSegments = productSegments;

        var productSegmentRoot = Organization.getProductSegmentRoot(organization);
        $scope.segments = _.filter(productSegments, function (segment) {
            return segment.id !== productSegmentRoot.id;
        });
    };

    var init = function () {
        $scope.isLoading = true;

        // Promises
        var currentUser = getCurrentUser();
        var users = getOrganizationUsers();
        var organization = getOrganization();
        var productSegments = getProductSegments();

        // All promises are resolved
        $q.all([currentUser, users, organization, productSegments]).then(function (data) {
          initScope.apply(this, data);
        });;
    };

    init();
}]);
