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
    '$rootScope', '$$track', '$window', '$location', '$analytics', 'permission', '$log', '$routeParams',
    function init ($rootScope, $$track, $window, $location, $analytics, permission, $log, $routeParams) {

        var formatPageName = function (path) {
            // Uniformize params for better aggregation
            _.forEach($routeParams, function (value, key) {
                path = path.replace(value, '{' + key + '}');
            });
            return 'Page ' + path.split('/').join(' ');
        };

        // tck tracking
        $$track.display();

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
                'First Login Date': new Date(),
                $email: user.username,
                $first_name: user.firstname,
                $last_name: user.lastname
            });
            $analytics.setSuperProperties({
                Organization: user.organizationId,
                company: user.company,
                type: permission.isRetailer() ? 'Retailer' : 'Maker',
                jobTitle: user.jobTitle
            })
        });

        return {};
}])

.service('$$track', ['$log',
    function Track ($log) {

    var _settings = {
        trackingCodeVersion: 5,
        trackingCodeType: 'dashboard-stream',
        urlPixelTracking: '//tck.toc.io/__tck.gif?',
        appId: 'UA-0000-10'
    };

    // Store recipe_id, Website_id, store, shop
    var _extra = {};

    var setExtra = function (key, value) {
        var extra = _extra;
        extra[key] = value;
        return;
    };

    var config = {
        events: {
            EVENT_DISPLAY                 : 1,  // The banner was displayed
            EVENT_PRODUCT_CHANGE          : 2,  // A Product was changed
            EVENT_QUANTITY_CHANGE         : 3,  // A quantity was changed
            EVENT_PRODUCT_CHECK           : 4,  // A Product was checked
            EVENT_PRODUCT_UNCHECK         : 5,  // A Product was unchecked
            EVENT_SHOP_CHANGE             : 6,  // The Shop was changed
            EVENT_STORE_CHANGE            : 7,  // The Store was changed
            EVENT_CART_ADD                : 8,  // Products were added to the Cart
            EVENT_SELECT_ALL              : 9,  // Select/Unselect All products was clicked
            EVENT_STORE_SEARCH_GEOLOC     : 10, // A geoloc based search for stores was made
            EVENT_STORE_DISPLAY_MORE      : 11, // A click on 'more stores' was made
            EVENT_STORE_SEARCH_MANUAL     : 12, // A manual postcode search was made
            EVENT_CART_GO                 : 16, // The user clicked on go to Shop
            EVENT_CART_NEXT               : 17, // The user clicked on view another Recipe
            EVENT_COOKIES_DISABLED        : 19,
            EVENT_PRODUCT_SHOW_DETAILS    : 30,  // The cookies were disabled
            EVENT_DISPLAY_CAMPAIGN        : 31
        }
    };

    var display = function () {
        var eventId = config.events.EVENT_DISPLAY;
        pixel(eventId);
    };

    var serialize = function (obj, prefix) {
          var str = [];
          for(var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
              serialize(v, k) :
              encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
          return str.join("&");
    };

    /**
     * Send the pixel tracking request
     *
     */
    var pixel = function (eventId, eventData) {
        var eventTracked = 'ticwv=' + _settings.trackingCodeVersion;
        eventTracked += '&tict=' + _settings.trackingCodeType;
        eventTracked += '&tica=' + eventId;
        eventTracked += (_extra === {}) ? '' : '&' + serialize(_extra);
        eventTracked += (typeof(eventData) === 'undefined') ? '' : '&' + serialize(eventData);
        eventTracked += '&ticac=' + _settings.appId;

        eventTracked += '&ticn=' + Math.floor((Math.random() * 100000000000) + 1); // CacheBuster
        $log.debug('eventTracked', eventTracked);
        return (new Image()).src = _settings.urlPixelTracking + eventTracked;
    };

    return {
        display: display,
        setExtra: setExtra
    }
}]);
