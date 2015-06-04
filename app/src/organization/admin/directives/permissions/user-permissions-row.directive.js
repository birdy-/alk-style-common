'use strict';

angular.module('jDashboardFluxApp').directive('userPermissionsRow', [
    function () {
        return {
            restrict: 'A',
            scope: {
              organization: '=',
              user: '=',
              productsegment: '=',
              userDeleted: '&'
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
    '$scope', '$$sdkAuth', 'permission', '$analytics',
    function ($scope, $$sdkAuth, permission, $analytics) {

        $scope.ProductSegment = ProductSegment;

        $scope.permissions = {};

        $scope.rmComfirmMsg = "Etes vous sûr de vouloir supprimer l'accès aux produits de la gamme " + $scope.productsegment.name;
        $scope.rmComfirmMsg += " pour l'utilisateur " + $scope.user.firstname + " " + $scope.user.lastname;
        $scope.rmComfirmMsg += " ?";


        var updatePermissions = function () {
            var newPermissions = $scope.user.getPSPermissions($scope.productsegment.id);

            $$sdkAuth.UserManagesProductSegmentUpdate(
                $scope.organization.id,
                $scope.productsegment.id,
                $scope.user.id,
                newPermissions
            );
          if (newPermissions.length == 0) {
            $scope.userDeleted($scope.user);
          }
        };

        var grant = function (permissionType) {
            $analytics.eventTrack('MAK Admin Allow' + permissionType);
            $scope.permissions[permissionType] = true;
            $scope.user.enablePSPermission($scope.productsegment.id, permissionType);

            // temporary hack
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_UPDATE) {
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED);

                // Give show permission by the way
                permissionType = ProductSegment.PERMISSION_PRODUCT_SHOW;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW] = true;
            }
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_SHOW) {
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED);
                $scope.user.enablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PS_SHOW);
            }
            updatePermissions();
        };

        var forbid = function (permissionType) {
            $analytics.eventTrack('MAK Admin Forbid' + permissionType);
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

                // Also remove edit
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE] = false;
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC);
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED);

                // Also remove certify
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_CERTIFY] = false;
                $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_CERTIFY);
            }

            updatePermissions();
        };

        $scope.removeFromSegment = function (permissionType) {
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PS_SHOW);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED);
            $scope.user.disablePSPermission($scope.productsegment.id, ProductSegment.PERMISSION_PRODUCT_CERTIFY);
            updatePermissions();
        };

        $scope.update = function (permissionType) {
            if ($scope.permissions[permissionType] === false)
                grant(permissionType);
            else
                forbid(permissionType);
        };

        var resetPermissions = function () {
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
        };

        var init = function () {
            $scope.permissions[ProductSegment.PERMISSION_PS_SHOW] = true;

            resetPermissions();

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
