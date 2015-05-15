'use strict';

angular.module('jDashboardFluxApp').directive('userPermissionsRow', [
    function () {
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


angular.module('jDashboardFluxApp').directive('segmentPermissionsRow', [
    function () {
        return {
            restrict: 'A',
            scope: {
              organization: '=',
              user: '=',
              productsegment: '='
            },
            templateUrl: '/src/organization/admin/directives/permissions/segment-permissions-row.view.html',
            controller:  'UserPermissionsRowController'
        };
    }
]);

angular.module('jDashboardFluxApp').controller('UserPermissionsRowController', [
    '$scope', '$$sdkAuth', '$$autocomplete', 'permission', '$route', '$timeout',
    function ($scope, $$sdkAuth, $$autocomplete, permission, $route, $timeout) {

        $scope.ProductSegment = ProductSegment;

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
                                                      newPermissions);
        };

        var grant = function (permissionType) {
            $scope.permissions[permissionType] = true;
            $scope.user.enablePSPermission($scope.productsegment.id, permissionType);

            // temporary hack
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_UPDATE) {
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED);
            }
            else if (permissionType === ProductSegment.PERMISSION_PRODUCT_SHOW) {
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED);
            }
            updatePermissions();
        };

        var forbid = function (permissionType) {
            $scope.permissions[permissionType] = false;

            $scope.user.disablePSPermission($scope.productsegment.id, permissionType);

            // temporary hack
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_UPDATE) {
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED);
            }
            else if (permissionType === ProductSegment.PERMISSION_PRODUCT_SHOW) {
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED);
            }
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
            if ($scope.permissions[permissionType] === false)
                grant(permissionType);
            else
                forbid(permissionType);
        };

        var init = function() {
            $scope.permissions[ProductSegment.PERMISSION_PS_SHOW] = true;

            // temporary : show means show.*
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW]              = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL]      = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC]     = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED]   = false;


            // temporary : update means updated.*
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE]            = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL]    = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC]   = false;
            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED] = false;

            $scope.permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY] = false;

            var permissions = _.filter($scope.user.managesProductSegment, function (segment) {
                return segment.id === $scope.productsegment.id;
            });

            permissions = permissions.length ? permissions[0].permissions : [];

            for (var k in $scope.permissions) {
                if (_.indexOf(permissions, k) !== -1) {
                    $scope.permissions[k] = true;
                }
            }
        };

        $scope.$watch('productsegment', function () {
          init();
        });

        $scope.$watch('user', function () {
          init();
        });

        init();
    }
]);
