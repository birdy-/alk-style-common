'use strict';


/**
 * Service that wraps tracking-related processes.
 * Use mainly for miaxpanel as of today.
 *
 */
angular.module('jDashboardFluxApp')

.config(['$analyticsProvider', function ($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
}])

.run([
    '$rootScope', '$window', '$location', '$analytics', 'permission', '$log',
    function init ($rootScope, $window, $location, $analytics, permission, $log) {

        var formatPageName = function (path) {
            return 'Page ' + path.split('/').join(' ');
        };


        // Page tracking for Mixpanel
        $rootScope.$on('$routeChangeSuccess', function () {
            $analytics.eventTrack('Page Viewed', {
                'page name': formatPageName($location.$$path),
                'url': $location.$$absUrl
            });
        });

        // User tracking
        $rootScope.$on('event:auth-loginConfirmed', function () {
            var user = permission.getUserInfo();
            if (!user) { return; }

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
