'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminProductSegmentPermissionsController', [
    '$scope', 'permission','$routeParams', '$location', '$modal', '$$ORM', '$window', '$$sdkAuth', '$$sdkCrud',
    function ($scope, permission, $routeParams, $location, $modal, $$ORM, $window, $$sdkAuth, $$sdkCrud) {

    $scope.currentUser = null;
    $scope.organizationId = $routeParams.id;
    $scope.segments = [];
    $scope.users = [];
    $scope.organization = null;


    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
    $scope.goHome = function() {
        $location.path($location.url($location.path('/')));
    };

    $scope.change = function (userId, productSegmentId) {
        $scope.matrix[userId][productSegmentId].hasChanged = true;
        $scope.hasModifications = true;
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

    $scope.inviteUser = function () {
        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/add.html',
            controller: 'OrganizationUserAddController',
            resolve: {
                organization:   function () { return $scope.organization; },
                brands:         function () { return null; },
                currentUser:    function () { return $scope.currentUser; }
            }
        });
    };

    $scope.selectSegment = function (segment) {
        $scope.segmentDetailsLoading = true;
        $$ORM.repository('ProductSegment').get(segment.id).then(function (segment) {
            $scope.selectedSegment = segment;
            console.log(segment);

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

    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------

    var loadProductSegments = function() {
        $$sdkCrud.ProductSegmentList({'organization_id':$scope.organizationId}, {}, {}, null, null).then(function (response) {
            $scope.segments = response.data.data;
            $scope.selectedSegment = $scope.segments[0];
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

    // $scope.selectedSegment = {
    //     name: 'test',
    //     stats: { counts: 42 },
    //     users: [
    //         {
    //             name: 'user1',
    //             username: 'a@aa.com',
    //             permissions: ['product.show', 'product.edit']
    //         },
    //         {name: 'user2'}
    //     ]
    // };

    // $scope.segments = [
    //     {name: 'segment1'},
    //     {name: 'segment2'},
    //     {name: 'segment3'}
    // ];

    var init = function () {

        permission.getUser().then(function (user) {
            $scope.currentUser = user;
            loadOrganization();
        });
    };

    init();
}]);
