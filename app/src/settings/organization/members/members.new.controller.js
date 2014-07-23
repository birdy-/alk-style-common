'use strict';

angular.module('jDashboardFluxApp').controller('SettingsOrganizationMembersNewCtrl', [
    '$scope', '$location', '$$BrandRepository', '$$sdkAuth', '$routeParams', 'permission', '$log', '$$autocomplete',
    function ($scope, $location, $$BrandRepository, $$sdkAuth, $routeParams, permission, $log, $$autocomplete) {

    $log.debug('Controller - SettingsCtrl');

    $scope.user = {};
    $scope.member = {};
    $scope.memberForm;

    var organizationId = $routeParams.id;

    // Load the organization
    // @authorization - need admin rights
    $$sdkAuth.OrganizationShow(organizationId).success(function (data) {
        $log.debug('OrganizationShow Ok - : ' + organizationId);
        $scope.organization = data.data;
    });

    // Load the current user
    permission.getUser().then(function (user) {
        $scope.user = user;
        $log.info('User Loaded');
    });

    /**
     * Start the User Creation Process
     *
     */
    $scope.save = function (member) {
        member.organization_id = organizationId;
        member.permission = member.isOrganizationAdmin ? 'admin' : 'data.quality.manager';
        $$sdkAuth.MemberInvite(member).success(function () {
            $location.path('/settings/organization/' + organizationId + '/members');
        }).error(function () {
            alert('Une erreur est survenue pendant la création de l\'utilisateur.');
        });

    };
}]);