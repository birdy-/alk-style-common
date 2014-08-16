'use strict';

angular.module('jDashboardFluxApp').controller('OrganizationProfileShowController', [
    '$scope', '$$sdkAuth', '$routeParams',
    '$$OrganizationRepository', '$$BrandRepository', '$$UserRepository',
    function ($scope, $$sdkAuth, $routeParams, $$OrganizationRepository, $$BrandRepository, $$UserRepository) {

    $scope.organization = {};
    $scope.brands = [];

    $scope.brandsOptions = {
        multiple: false,
        allowClear: true,
        minimumInputLength: 1,
        data: $scope.brands
    };

    // --------------------------------------------------------------------------------
    // Event binding
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    // Init
    // --------------------------------------------------------------------------------

    var organizationId = $routeParams.id;
    $$OrganizationRepository.get(organizationId).then(function (entity) {
        $scope.organization = entity;
    });

    var loadUsers = function () {
        $$sdkAuth.OrganizationUsers(organizationId).then(function (response) {
            $scope.users = response.data.data.map(function (json) {
                return $$UserRepository.hydrate(json);
            });
        });
    };
    loadUsers();

    var loadBrands = function () {
        $$sdkAuth.OrganizationBrands(organizationId).then(function (response) {
            response.data.data.forEach(function (brand) {
                $$BrandRepository.get(brand.id).then(function (entity) {
                    $scope.brands.push(entity);
                });
            });
        });
    };
    loadBrands();


}]);