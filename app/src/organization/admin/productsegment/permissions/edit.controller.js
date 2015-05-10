'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminProductSegmentPermissionsController', [
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

    $scope.editProductSegment = function (productsegment_id) {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/create/create-modal.html',
            controller: 'ProductSegmentCreateModalController',
            resolve: {
                organization_id: function() { return $scope.organizationId; },
                productsegment_id: function() { return productsegment_id; }
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

    $scope.selectSegment = function (segment) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segment.id, { 'with_users':true }).then(function (segment) {
            $scope.selectedSegment = segment;


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

    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------

    var loadProductSegments = function() {
        $$sdkCrud.ProductSegmentList({'organization_id':$scope.organizationId}, {}, {}, null, null).then(function (response) {
            var productSegmentRoot = Organization.getProductSegmentRoot($scope.organization);
            $scope.segments = _.filter(response.data.data, function (segment) {
                return segment.id !== productSegmentRoot.id;
            });
            $scope.selectSegment($scope.segments[0]);
            $scope.isLoading = false;
        });
    }

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
