'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminUserPermissionsController', [
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

    $scope.createUser = function () {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function() { return $scope.organizationId; },
                productsegment_id: function() { return null; }
            }
        });
    };

    $scope.editUser = function (segmentId) {
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

    $scope.selectUser = function (userId) {
      var user = _.find($scope.users, { id: userId });

      $scope.selectedUser = user;
    };

    $scope.addProductSegment = function (segment) {
        $modal.open({
            templateUrl: 'src/organization/admin/productsegment/permissions/add-productsegment-modal.html',
            controller: 'ProductSegmentAddProductSegmentModalController',
            resolve: {
                user: function() { return $scope.selectedUser; },
                organization: function() { return $scope.organization; }
            }
        }).result.then(function () {
            init();
            $scope.selectUser($scope.selectedUser.id);
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

        $scope.isLoading = false;
        $scope.currentUser = currentUser;
        $scope.users = userObjects;
        $scope.organization = organization;

        var productSegmentRoot = Organization.getProductSegmentRoot(organization);
        var segments = _.filter(productSegments, function (segment) {
            return segment.id !== productSegmentRoot.id;
        });

        $scope.segments = {};
        for (var i = 0; i < segments.length; i++) {
            $scope.segments[segments[i].id] = segments[i];
        }
        if (users.length) {
            var defaultUserId = $routeParams.user_id || users[0].id;
            $scope.selectUser(defaultUserId);
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
