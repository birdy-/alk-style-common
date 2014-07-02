'use strict';

angular.module('jDashboardFluxApp').service('$brandCache', [
    '$$sdkCrud',
    function service($$sdkCrud) {

        var brandCache = {};

        var BrandGet = function (id, callback) {
            
            if (typeof(brandCache[id]) !== 'undefined') {
                return callback(brandCache[id]);
            }

            return $$sdkCrud.BrandShow(id).success(function (response) {
                var brand = response.data;
                // Cache Brand for future reuse
                brandCache[id] = brand;
                callback(brand);
            });
        }


        return {
            BrandGet: BrandGet
        };

}]);