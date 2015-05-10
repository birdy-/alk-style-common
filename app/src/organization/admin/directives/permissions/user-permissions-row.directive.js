'use strict';

angular.module('jDashboardFluxApp').directive('userPermissionsRow', [
    '$rootScope', '$location',
    function ($rootScope, $location) {
        return {
            restrict: 'A',
            scope: {
              organization: '=',
              user: '=',
              productsegment: '='
            },
            templateUrl: '/src/organization/admin/directives/permissions/user-permissions-row.view.html',
            controller:  'UserPermissionsRowController'
        };
    }
]);


angular.module('jDashboardFluxApp').controller('UserPermissionsRowController', [
    '$scope', '$$sdkAuth', '$$autocomplete', 'permission', '$route', '$timeout',
    function ($scope, $$sdkAuth, $$autocomplete, permission, $route, $timeout) {

        $scope.ProductSegment = ProductSegment;

        $scope.isInactive = false;
        $scope.permissions = {};


        $scope.rmComfirmMsg = "Etes vous sûr de vouloir supprimer l'accès aux produits de la gamme " + $scope.productsegment.name;
        $scope.rmComfirmMsg += " pour l'utilisateur " + $scope.user.firstname + " " + $scope.user.lastname;
        $scope.rmComfirmMsg += " ?";


        var updatePermissions = function () {
            var newPermissions = [];
            for (var k in $scope.permissions) {
                if ($scope.permissions[k] == true) 
                    newPermissions.push(k);
            }

            $$sdkAuth.UserManagesProductSegmentUpdate($scope.organization.id,
                                                      $scope.productsegment.id,
                                                      $scope.user.id,
                                                      newPermissions)
            .then(function (response) {
                if ($scope.permissions[ProductSegment.PERMISSION_PS_SHOW] === false)
                    $scope.isInactive = true;
            });
        };

        var grant = function (permissionType) {
            $scope.permissions[permissionType] = true;
            updatePermissions();
        };

        var forbid = function (permissionType) {
            $scope.permissions[permissionType] = false;
            updatePermissions();  
        };

        $scope.removeFromSegment = function (permissionType) {
            $scope.permissions[ProductSegment.PERMISSION_PS_SHOW]               = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE]        = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW]          = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY]       = false;
            updatePermissions();
        };


        $scope.update = function (permissionType) {
            if ($scope.permissions[permissionType] == false)
                grant(permissionType);
            else
                forbid(permissionType);
        };

        var init = function() {
            $scope.permissions[ProductSegment.PERMISSION_PS_SHOW] = true;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW] = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE] = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY] = false;
            $scope.user.permission.map(function (permission) {
                if (permission === ProductSegment.PERMISSION_PRODUCT_SHOW)
                    $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW] = true;
                if (permission === ProductSegment.PERMISSION_PRODUCT_UPDATE)
                    $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE] = true;
                if (permission === ProductSegment.PERMISSION_PRODUCT_CERTIFY)
                    $scope.permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY] = true;
            });
        };

        init();
    }
]);