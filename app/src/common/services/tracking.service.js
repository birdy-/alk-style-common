'use strict';


/**
 * Service that wraps tracking-related processes.
 * Use mainly for miaxpanel as of today.
 *
 */
angular.module('jDashboardFluxApp')

.run([
    '$rootScope', '$window', '$location', '$analytics', 'permission', '$log', '$routeParams',
    function init ($rootScope, $window, $location, $analytics, permission, $log, $routeParams) {

        var formatPageName = function (path) {
            // Uniformize params for better aggregation
            _.forEach($routeParams, function (value, key) {
                path = path.replace(value, '{' + key + '}');
            });
            return 'Page ' + path.split('/').join(' ');
        };


        // Page tracking for Mixpanel
        $rootScope.$on('$routeChangeSuccess', function () {
            $window.mixpanel.track(
                formatPageName($location.$$path),
                _.extend($routeParams, {'url': $location.$$absUrl})
            );
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
                type: permission.isRetailer() ? 'Retailer' : 'Maker',
                jobTitle: user.jobTitle
            })
        });


        return {};
}]);
