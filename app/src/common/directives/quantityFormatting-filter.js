'use strict';

angular.module('jDashboardFluxApp').filter('alkPowerOfThousands', function () {
    return function (value) {
        if (value > 1000000) {
            return (value / 1000000).toFixed(2) + ' M';
        }
        if (value > 1000) {
            return (value / 1000).toFixed(2) + ' k';
        }
        return value;
    };
});
