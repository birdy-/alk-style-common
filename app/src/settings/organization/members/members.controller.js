'use strict';

angular.module('jDashboardFluxApp').controller('SettingsOrganizationMembersCtrl', [
    '$scope', '$$sdkCrud', '$brandCache', '$$sdkAuth', '$routeParams', 'permission', '$log', '$$autocomplete',
    function ($scope, $$sdkCrud, $brandCache, $$sdkAuth, $routeParams, permission, $log, $$autocomplete) {

    $log.debug('Controller - SettingsCtrl');
    
    $scope.user = {};
    $scope.brands = [];

    var organizationId = $routeParams.id;
    $scope.organizationId = organizationId;

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
        });        
    };
    loadMembers();

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

}]).filter('filterPermission', function() {
    return function(input) {
        return input == 'admin' ? 'Administrateur' : 'DataQualityUser';
    };
});

