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
        for (var key in segment.usersPermissions) {
            Array.prototype.push.apply(allowedUserIds, segment.usersPermissions[key]);
        }
        allowedUserIds = _.uniq(allowedUserIds);

        for (var i = 0; i < allowedUserIds.length; i++) {
            users.push(_.find($scope.users, { id: allowedUserIds[i] }));
        }

        return users;
     };

    $scope.selectSegment = function (segmentId) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segmentId, { 'with_permissions':true }).then(function (segment) {
            $scope.selectedSegment = segment;

            segment.users = getUsersFromSegment(segment);
            $scope.segmentDetailsLoading = false;
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
        var query = {
            organization_id: $scope.organizationId,
            withPermissions: 1
        };
        return $$ORM.repository('ProductSegment').list(query, {}, {}, null, null);
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

        var userObjects = [];
        for (var i = 0; i < users.length; i++) {
            userObjects.push(new User(users[i]));
        }

        $scope.isLoading = false;
        $scope.currentUser = currentUser;
        $scope.users = userObjects;
        $scope.organization = organization;
        $scope.productSegments = productSegments;

        var productSegmentRoot = Organization.getProductSegmentRoot(organization);
        $scope.segments = _.filter(productSegments, function (segment) {
            return segment.id !== productSegmentRoot.id;
        });

        for (var i = 0; i < $scope.segments.length; i++) {
            $scope.segments[i].users = getUsersFromSegment($scope.segments[i]);
        }

        if ($scope.segments.length) {
            var defaultSegmentId = $routeParams.segment_id || $scope.segments[0].id;
            $scope.selectSegment(defaultSegmentId);
        }
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
