'use strict';

angular.module('jDashboardFluxApp')

.service('$$graphTools',
    function service () {
        var d3 = window.d3;

        var dateFilter = function () {
            return function (d) {
                return d3.time.format('%d-%m-%y')(new Date(d)); //uncomment for date format
            };
        };
        var floatFilter = function () {
            return function (d) {
                return d3.format(',f')(d);
            };
        };

        var colorArray = ['gray', '#F5B626', '#3737FF', '#C6221F'];
        var colorIterator = function () {
            return function (d, i) {
                return colorArray[i];
            };
        };

        return {
            dateFilter: dateFilter,
            floatFilter: floatFilter,
            colorIterator: colorIterator
        };
    }
);
