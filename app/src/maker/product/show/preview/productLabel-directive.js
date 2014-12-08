"use strict";

angular.module('jDashboardFluxApp').directive('alkProductLabel', function () {

    var getProductHasLabelFromId = function (labels, id) {
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].concept.id === id) {
                return i;
            }
        }
        return -1;
    };

    return {
        restrict: 'AEC',
        replace: true,
        scope: {
            legend: '=',
            product: '='
        },
        templateUrl: '/src/maker/product/show/preview/productLabel-directive.html',
        link: function(scope, element, attrs) {

            scope.$watch('product.isLabeledBy', function (labels) {
                if (!labels) {
                    return;
                }
                var index = getProductHasLabelFromId(labels, scope.legend.id);
                if (index !== -1) {
                    scope.label = true;
                } else {
                    scope.label = false;
                }
            }, true);
        }
    };
});