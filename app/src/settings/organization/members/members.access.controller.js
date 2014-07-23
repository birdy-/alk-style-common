'use strict';

angular.module('jDashboardFluxApp').controller('SettingsOrganizationMembersAccessCtrl', [
    '$scope', '$$sdkCrud', '$$BrandRepository', '$$sdkAuth', '$routeParams', 'permission', '$log', '$$autocomplete',
    function ($scope, $$sdkCrud, $$BrandRepository, $$sdkAuth, $routeParams, permission, $log, $$autocomplete) {

    $log.debug('Controller - SettingsCtrl');

    $scope.user = {};
    $scope.brands = [];

    var organizationId = $routeParams.id;

    // Load the organization
    // @authorization - need admin rights
    $$sdkAuth.OrganizationShow(organizationId).success(function (data) {
        $log.debug('OrganizationShow Ok - : ' + organizationId);
        $scope.organization = data.data;
    });

    // Fetch members
    // @authorization - need admin rights
    /**
     * Load the members of an organization
     * + Retrieve their managed brand datas
     *
     */
    var loadMembers = function () {
        $$sdkAuth.OrganizationMembers(organizationId).success(function (data) {
            $log.debug('Retrieved OrganizationMembers for Organization: ' + organizationId);

            data = data.data;
            $scope.members = data;

            $scope.members.forEach(function (member) {
                member.managesBrand.forEach(function (brand) {
                    $$BrandRepository.get(brand.id).then(function (data) {
                        angular.copy(data, brand);
                    });
                });
            });

        });
    };
    loadMembers();

    /**
     * Load the brands owned by an organization
     * + Retrieve the managed brand datas
     * + add to autocomplete
     */
    var loadBrands = function () {
        $$sdkAuth.OrganizationBrands(organizationId).success(function (data) {
            $log.debug('Retrieved OrganizationBrands for Organization: ' + organizationId);
            var brands = data.data;
            brands.forEach(function (brand) {
                $$BrandRepository.get(brand.id).then(function (data) {
                    angular.copy(data, brand);
                    brand.text = brand.name;
                    $scope.brands.push(brand);
                });
            });
        });
    };
    loadBrands();

    $scope.brandsOptions = {
        multiple: false,
        allowClear: true,
        minimumInputLength: 1,
        data: $scope.brands
    };

    // Load the current user
    permission.getUser().then(function (user) {
        $scope.user = user;
        $log.info('User Loaded');
    });

    $scope.addBrandToManagedBrands = function(member) {
        var brand = member.newBrand;
        if (!brand) {
            return;
        }
        $$sdkAuth.PluginAdd(member.id, {
            plugin_id: 205, // Plugin Product Stream --> Should be replaced
            brand_id: brand.id,
            organization_id: organizationId
        }).success(loadMembers).error(function(){ alert('ko')});
    };

    $scope.deleteBrandFromManagedBrands = function(member, brand) {
        $$sdkAuth.PluginRemove(member.id, {
            plugin_id: 205, // Plugin Product Stream --> Should be replaced
            brand_id: brand.id,
            organization_id: organizationId
        }).success(loadMembers).error(function(){ alert('ko')});
    };

}]);