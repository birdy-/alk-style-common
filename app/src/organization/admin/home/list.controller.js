'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationAdminHomeListController', [
    '$scope', 'permission','$$ORM', '$$sdkAuth', '$routeParams', '$location', 'ngToast',
    function ($scope, permission, $$ORM, $$sdkAuth, $routeParams, $location, ngToast) {

    $scope.organization = {};

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------
    $scope.organizationId = Number($routeParams.id);
    $$ORM.repository('Organization').get($scope.organizationId).then(function (entity) {
        $scope.organization = entity;
        loadSegments();
    });

    var loadSegments = function () {
        var productSegmentIds = $scope.organization.ownsProductSegment.map(function (productSegment) {
            return productSegment.id;
        });
        $$ORM.repository('ProductSegment').list({organization_id: $scope.organizationId}, {filter_id_in: productSegmentIds}, {}, 0, 100).then(function (segments) {
            $scope.productSegments = segments;
        });
    };
    var init = function () {
        permission.getUser().then(function(user) {
            $scope.currentUser = user;
            if (!permission.isAdmin($scope.organizationId)) {
                ngToast.create({
                    className: 'danger',
                    content: "Vous n'etes pas administrateur pour cette organisation !",
                    timeout: 3000
                    });
                $location.path("/user/me/profile");
            }
        });
    };
    init();
}]);
