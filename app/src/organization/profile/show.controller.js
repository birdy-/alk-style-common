'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationProfileShowController', [
    '$scope', '$$sdkAuth', '$routeParams', '$modal', '$$ORM',
    function ($scope, $$sdkAuth, $routeParams, $modal, $$ORM) {

    $scope.organization = {};
    $scope.brands = [];
    $scope.organizationForm = {};
    $scope.organizationFormInit = function(form) {
        form.$loading = true;
        form.$saving = false;
        $scope.organizationForm = form;
    };

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    $scope.updateOrganization = function() {
        $scope.organizationForm.$saving = true;
        $$sdkAuth.OrganizationUpdate($scope.organization).then(function(response){
            $scope.organizationForm.$saving = false;
            $scope.organizationForm.$setPristine();
        });
    };

    $scope.addUser = function() {
        var modalInstance = $modal.open({
            templateUrl: '/src/organization/user/add.html',
            controller: 'OrganizationUserAddController',
            resolve: {
                organization: function() {
                    return $scope.organization;
                }
            }
        });

        modalInstance.result.then(function () {
            loadUsers();
        }, function () {
        });
    };

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------

    var organizationId = $routeParams.id;
    $$ORM.repository('Organization').get(organizationId).then(function (entity) {
        $scope.organization = entity;
        $scope.organizationForm.$loading = false;
    });

    var loadUsers = function () {
        $$sdkAuth.OrganizationUsers(organizationId).then(function (response) {
            $scope.users = response.data.data.map(function (json) {
                retur.hydrate(json);
            });
        });
    };
    loadUsers();

    var loadBrands = function () {
        $$sdkAuth.OrganizationBrands(organizationId).then(function (response) {
            var brandIds = response.data.data.map(function (brand) {
                return brand.id;
            });
            $$ORM.repository('Brand').list({}, {id: brandIds}, {}, 0, 100).then(function(brands) {
                $scope.brands = brands;
            });
        });
    };
    loadBrands();


}]);