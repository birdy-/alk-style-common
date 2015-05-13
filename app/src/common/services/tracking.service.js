'use strict';


/**
 * Service that wraps tracking-related processes.
 * Use mainly for miaxpanel as of today.
 *
 */
angular.module('jDashboardFluxApp')

.run([
    '$rootScope', '$window', '$location', '$analytics', 'permission', '$log',
    function init ($rootScope, $window, $location, $analytics, permission, $log) {

        var formatPageName = function (path) {
            return 'Page ' + path.split('/').join(' ');
        };


        // Page tracking for Mixpanel
        $rootScope.$on('$routeChangeSuccess', function () {
            $window.mixpanel.track('Page Viewed', {
                'page name': formatPageName($location.$$path),
                'url': $location.$$absUrl
            });
        });

        // User tracking
        $rootScope.$on('event:auth-loginConfirmed', function () {
            var user = permission.getUserInfo();
            if (!user) { return; }
            console.log(user);
            $analytics.setUsername(user.username);
            $analytics.setUserPropertiesOnce({
                'First Login Date': new Date()
            });
            $analytics.setSuperProperties({
                Organization: user.organizationId,
                company: user.company,
                jobTitle: user.jobTitle
            })
        });


        return {};
}]);
