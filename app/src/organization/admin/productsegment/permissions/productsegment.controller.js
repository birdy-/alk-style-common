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

    $scope.rmComfirmMsg = "Etes vous sûr de vouloir supprimer se segment ?"


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
        }).result.then(function () {
            init();
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
        }).result.then(function () {
            init();
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
        var allowedUserIds = [];

      _.forEach(segment.usersPermissions, function (value, permission) {
        _.forEach(value, function (userId) {
          allowedUserIds.push(userId);
          var user = _.find($scope.users, {id: userId});
          var userManagesSegment = _.find(user.managesProductSegment, {id: segment.id});
          if (!userManagesSegment) {
            userManagesSegment = {id: segment.id, permissions: []};
            user.managesProductSegment.push(userManagesSegment);
          }
          userManagesSegment.permissions.push(permission);
        });
      });


      allowedUserIds = _.uniq(allowedUserIds);
      var users = [];
      _.forEach(allowedUserIds, function (userId) {
        users.push(_.find($scope.users, {id: userId}));
      });
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

    $scope.deleteProductSegment = function () {
        $$ORM.repository('ProductSegment').method('Delete')($scope.selectedSegment.id, $scope.organizationId).then(function (response) {
            init();
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
    };

      $scope.userDeleted = function (user) {
        _.remove($scope.selectedSegment.users, function (u) {
          return u.id === user.id;
        });
      };

    $scope.toggleSearchDisplay = function () {
        // set focus on search
        $scope.displaySearch = !$scope.displaySearch;
        return;
    };

    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------

    var getProductSegments = function () {
        var query = {
            organization_id: $scope.organizationId,
            withPermissions: 1
        };
        var limit = $scope.organization.ownsProductSegment.length;
        return $$ORM.repository('ProductSegment').list(query, {}, {}, null, limit);
    };

    var getOrganization = function () {
        return $$sdkAuth.OrganizationShow($scope.organizationId);
    };

    var getOrganizationUsers = function () {
        return $$sdkAuth.OrganizationUsers($scope.organizationId);
    }

    var getCurrentUser = function () {
        return permission.getUser();
    };

    var loadOrganization = function (organization) {
        organization = organization.data.data;
        $scope.organization = organization;
    };

    var initScope = function (currentUser, users, productSegments) {
        users = users.data.data;

        var userObjects = [];
        for (var i = 0; i < users.length; i++) {
            userObjects.push(new User(users[i]));
        }

        $scope.isLoading = false;
        $scope.currentUser = currentUser;
        $scope.users = userObjects;

        var productSegmentRoot = Organization.getProductSegmentRoot($scope.organization);
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

        var organization = getOrganization();

        $q.all([organization]).then(function (data) {
            loadOrganization.apply(this, data);

            // Promises
            var currentUser = getCurrentUser();
            var users = getOrganizationUsers();
            var productSegments = getProductSegments();

            // All promises are resolved
            $q.all([currentUser, users, productSegments]).then(function (data) {
              initScope.apply(this, data);
            });;
        });;

    };

    init();
}]);
