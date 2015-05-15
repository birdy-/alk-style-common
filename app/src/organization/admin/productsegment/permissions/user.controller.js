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
      var user = _.filter($scope.users, function(user) { return user.id === userId; });
      if (user.length === 0) {
        return;
      }

      user = user[0];
      user.productSegments = [];
      for (var i = 0; i < user.managesProductSegment.length; i++) {
        var segment = _.filter($scope.segments, function (segment) { return segment.id === user.managesProductSegment[i].id; });
        if (segment.length) {
          user.productSegments.push(segment[0]);
        }
      }

      $scope.selectedUser = user;
    };

    $scope.addProductSegment = function (segment) {
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

        $scope.isLoading = false;
        $scope.currentUser = currentUser;
        $scope.users = userObjects;
        $scope.organization = organization;
        $scope.productSegments = productSegments;

        var productSegmentRoot = Organization.getProductSegmentRoot(organization);
        $scope.segments = _.filter(productSegments, function (segment) {
            return segment.id !== productSegmentRoot.id;
        });

        var defaultUserId = $routeParams.user_id || users[0].id;
        $scope.selectUser(defaultUserId);
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
