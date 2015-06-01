'use strict';

angular.module('jDashboardFluxApp').directive('roleSticker', [
    'permission',
    function (permission) {
    return {
        restrict: 'AEC',
        scope: {
            relation: '=',
            roleDelete: '=',
            roleAdd: '='
        },
        replace: true,
        templateUrl: '/src/user/role/role.html',
        link: function(scope, elem, attrs) {
            scope.role = null;

            permission.getUser().then(function (user) {
                if (user.isAlkemicsAdmin()) {
                    scope.displayRoleDelete = true;
                }
            });
            /*
            scope.$watch(function(){
                if (!scope.relation
                || !scope.relation.permissions) {
                    return null;
                }
                return scope.relation.permissions;
            }, function(){
                if (!scope.relation
                || !scope.relation.permissions) {
                    return;
                }
                var value = scope.relation.permissions;
                if (value.indexOf('brand.update') !== -1
                && value.indexOf('product.show') !== -1
                && value.indexOf('product.create') !== -1
                && value.indexOf('product.update.semantic') !== -1
                && value.indexOf('product.update.normalized') !== -1
                && value.indexOf('product.update.textual') !== -1
                && value.indexOf('brand.show') !== -1
                && value.indexOf('brand.update') !== -1) {
                    if (value.indexOf('product.certify') !== -1) {
                        scope.role = 'Administrateur';
                    } else {
                        scope.role = 'Contributeur';
                    }
                } else {
                    scope.role = 'Autre';
                }
            });
            */
        }
    };
}]);
