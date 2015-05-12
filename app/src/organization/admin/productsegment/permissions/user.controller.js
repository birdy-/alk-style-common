'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminUserPermissionsController', [
    '$scope', 'permission','$routeParams', '$location', '$modal', '$$ORM', '$window', '$$sdkAuth', '$$sdkCrud',
    function ($scope, permission, $routeParams, $location, $modal, $$ORM, $window, $$sdkAuth, $$sdkCrud) {

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

    var loadProductSegments = function() {
        $$sdkCrud.ProductSegmentList({'organization_id':$scope.organizationId}, {}, {}, null, null).then(function (response) {
            var productSegmentRoot = Organization.getProductSegmentRoot($scope.organization);

            $scope.segments = _.filter(response.data.data, function (segment) {
                return segment.id !== productSegmentRoot.id;
            });

            var defaultUserId = $routeParams.user_id || $scope.users[0].id;

            $scope.selectUser(defaultUserId);

            $scope.isLoading = false;
        });
    };


    var loadOrganization = function () {
        $$sdkAuth.OrganizationShow($scope.organizationId).then(function (response) {
            $scope.organization = response.data.data;
            $$sdkAuth.OrganizationUsers($scope.organizationId).then(function (response) {
                $scope.users = response.data.data;

                loadProductSegments();
            });
        });
    };

    var init = function () {

        permission.getUser().then(function (user) {
            $scope.currentUser = user;
            $scope.isLoading = true;
            loadOrganization();
        });
    };

    init();
}]);
