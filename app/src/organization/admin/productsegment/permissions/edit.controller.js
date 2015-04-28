'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminProductSegmentPermissionsController', [
    '$scope', 'permission','$routeParams', '$location', '$modal', '$$ORM', '$window', '$$sdkAuth', '$$sdkCrud',
    function ($scope, permission, $routeParams, $location, $modal, $$ORM, $window, $$sdkAuth, $$sdkCrud) {

   	// --------------------------------------------------------------------------------
    // Variables
 	// --------------------------------------------------------------------------------
    $scope.organizationId = Number($routeParams.id);
 	$scope.currentUser = null;
   	$scope.productSegmentIds = [];
   	$scope.users = [];
   	$scope.productSegments = [];
    $scope.matrix = {};
    $scope.ProductSegmentModel = ProductSegment;
    $scope.hasModifications = false;

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------
	$scope.goHome = function() {
        $location.path($location.url($location.path('/')));
    };


    $scope.initMatrix = function () {
        $scope.users.map(function (user) {
            $scope.matrix[user.id] = {};
            user.managesProductSegment.map(function (productSegment) {
                $scope.matrix[user.id][productSegment.id] = {};
                $scope.matrix[user.id][productSegment.id].permissions = {};
                $scope.matrix[user.id][productSegment.id].permissions[ProductSegment.PERMISSION_PS_SHOW]         = false;
                $scope.matrix[user.id][productSegment.id].permissions[ProductSegment.PERMISSION_PRODUCT_SHOW]    = false;
                $scope.matrix[user.id][productSegment.id].permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE]  = false;
                $scope.matrix[user.id][productSegment.id].permissions[ProductSegment.PERMISSION_PRODUCT_DELETE]  = false;
                $scope.matrix[user.id][productSegment.id].permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY] = false;
                productSegment.permissions.map(function (permission) {
                    $scope.matrix[user.id][productSegment.id].permissions[permission] = true;
                });
                $scope.matrix[user.id][productSegment.id].hasChanged = false;
            });
        });
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
                organization_id: function() { return $scope.organizationId; }
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
    	

    $scope.save = function () {
        for (var userId in $scope.matrix) {
            for (var psId in $scope.matrix[userId]) {
                if ($scope.matrix[userId][psId].hasChanged === true) {
                    var permissions = [];
                    for (var permission in $scope.matrix[userId][psId].permissions) {
                        if (( permission == ProductSegment.PERMISSION_PRODUCT_SHOW 
                            || permission == ProductSegment.PERMISSION_PRODUCT_UPDATE
                            || permission == ProductSegment.PERMISSION_PRODUCT_DELETE
                            || permission == ProductSegment.PERMISSION_PRODUCT_CERTIFY) 
                            && $scope.matrix[userId][psId].permissions[permission] === true)
                            permissions.push(permission);   
                    }
                    $$sdkAuth.UserManagesProductSegmentUpdate($scope.organizationId, psId, userId, permissions).then(function (response) {
                        console.log('Permissions mises a jour');
                    });
                }
            }
        }
    };


    // --------------------------------------------------------------------------------
    // Initialization
    // --------------------------------------------------------------------------------
    
    var loadProductSegments = function() {
        $$sdkCrud.ProductSegmentList({'organization_id':$scope.organizationId}, {}, {}, null, null).then(function (response) {
            $scope.productSegments = response.data.data;
            $scope.initMatrix();
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
            if (permission.isAdmin($scope.organizationId)) {
                loadOrganization();
            }
            else {
                $scope.goHome();
            }
        });
    };

    init();
}]);