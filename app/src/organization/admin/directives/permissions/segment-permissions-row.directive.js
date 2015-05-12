'use strict';

angular.module('jDashboardFluxApp').directive('segmentPermissionsRow', [
    '$rootScope', '$location',
    function ($rootScope, $location) {
        return {
            restrict: 'A',
            scope: {
              organization: '=',
              user: '=',
              productsegment: '='
            },
            templateUrl: '/src/organization/admin/directives/permissions/segment-permissions-row.view.html',
            controller:  'SegmentPermissionsRowController'
        };
    }
]);


angular.module('jDashboardFluxApp').controller('SegmentPermissionsRowController', [
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
            // temporary hack
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_UPDATE) {
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL]    = true;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC]   = true;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED] = true;
            }
            else if (permissionType === ProductSegment.PERMISSION_PRODUCT_SHOW) {
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL]      = true;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC]     = true;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED]   = true;
            }
            updatePermissions();
        };

        var forbid = function (permissionType) {
            $scope.permissions[permissionType] = false;
            // temporary hack
            if (permissionType === ProductSegment.PERMISSION_PRODUCT_UPDATE) {
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_TEXTUAL]    = false;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_SEMANTIC]   = false;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_UPDATE_NORMALIZED] = false;
            }
            else if (permissionType === ProductSegment.PERMISSION_PRODUCT_SHOW) {
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_TEXTUAL]      = false;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_SEMANTIC]     = false;
                $scope.permissions[ProductSegment.PERMISSION_PRODUCT_SHOW_NORMALIZED]   = false;
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
            if ($scope.permissions[permissionType] == false)
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

            for (var k in $scope.permissions) {
                if (_.indexOf($scope.user.permission, k) !== -1)
                    $scope.permissions[k] = true;
            }
        };

        init();
    }
]);
