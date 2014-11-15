'use strict';

angular.module('jDashboardFluxApp').directive('labelGroup', function () {
    return {
        restrict: 'A',
        scope: {
            product: '=',
            title: '=',
            labels: '='
        },
        templateUrl: '/src/maker/product/show/label/label-group.view.html'
    };
});
