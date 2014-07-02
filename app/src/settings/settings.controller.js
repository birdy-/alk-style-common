'use strict';

angular.module('jDashboardFluxApp').controller('SettingsSideBarCtrl', [
    '$scope', '$$sdkAuth', '$routeParams', 'permission', '$log',
    function ($scope, $$sdkAuth, $routeParams, permission, $log) {

    $log.debug('Controller - SettingsSideBarCtrl');

    permission.getUser().then(function (user) {
        
        $log.info('User Loaded', user);        
        // Array of organization 
        // for which the user is admin
        user.belongsToAdmin = [];

        // Iterate over all the organizations to which
        // user belongs
        user.belongsTo.forEach(function (organization) {            
            
            // Only if user is admin
            if (organization.permissions.indexOf('admin') !== -1) {
            
                // and fetch additional data (name, ...)
                $$sdkAuth.OrganizationShow(organization.id, function (data) {                                
                    // Add the organization to the array
                    user.belongsToAdmin.push(data.data);
                });                                    
            }                        
        });
        $scope.user = user;

    });
}]);

angular.module('jDashboardFluxApp').controller('SettingsCtrl', [
    '$scope', '$$sdkAuth', '$routeParams', 'permission', '$log',
    function ($scope, $$sdkAuth, $routeParams, permission, $log) {

    $log.debug('Controller - SettingsCtrl');

    
}]);
