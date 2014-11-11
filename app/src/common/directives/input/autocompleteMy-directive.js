'use strict';

 /**
  * Select input, preloaded with brands that the user is allowed to manipulate.
  */
angular.module('jDashboardFluxApp').directive('alkAutocompleteMy', [
    'permission', '$$autocomplete', '$$ORM',
    function (permission, $$autocomplete, $$ORM) {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
            multiple: '&alkAutocompleteMultiple',
            restrict: '=alkAutocompleteRestrict'
        },
        require: 'ngModel',
        templateUrl: '/src/common/directives/input/select-2.html',
        controller: function($scope, $element, $attrs) {
            // A controller is necessary in order to initialized the select2 config

            // Decide whether to use simple or multiple selection
            var extra = {};
            if ($scope.multiple() === false) {
                extra.multiple = false;
                extra.maximumSelectionSize = 1;
            } else {
                extra.multiple = true;
            }

            // Decide whether to use ajax or simple data
            var type = $attrs.alkAutocompleteType.toLowerCase();
            if (['brand', 'website', 'shop'].indexOf(type) !== -1) {
                extra.minimumInputLength = 0;
                extra.data = [];
            } else {
                extra.minimumInputLength = 2;
                extra = $$autocomplete.getOptionAutocompletes(type, extra, $scope.filters);
            }
            extra.initSelection = function(el, fn) {};

            // Finally setup the autocomplete
            $scope.options = extra;
        },
        link: function(scope, elem, attrs) {

            // -----------------------------------------------------------------------------------
            // Variables
            // -----------------------------------------------------------------------------------
            // Clean filters
            scope.filters = {};
            scope.placeholder = attrs.placeholder;

            // -----------------------------------------------------------------------------------
            // Data retrievers
            // -----------------------------------------------------------------------------------

            // -----------------------------------------------------------------------------------
            // Event listenning
            // -----------------------------------------------------------------------------------

            // -----------------------------------------------------------------------------------
            // Init
            // -----------------------------------------------------------------------------------
            var type = attrs.alkAutocompleteType.toLowerCase();
            permission.getUser().then(function (user) {
                scope.filters = scope.restrict || {};

                // Simple list search
                if (type === 'brand') {
                    var ids = user.managesBrand.map(function (entity) {
                        return entity.id;
                    }).join(',');
                    $$ORM.repository('Brand').list({}, {id: ids}).then(function (entitys) {
                        scope.options.data = entitys;
                    });
                } else if (type === 'website') {
                    var ids = user.managesWebsite.map(function (entity) {
                        return entity.id;
                    }).join(',');
                    $$ORM.repository('Website').list({}, {id: ids}).then(function (entitys) {
                        scope.options.data = entitys;
                    });
                } else if (type === 'shop') {
                    var ids = user.managesShop.map(function (entity) {
                        return entity.id;
                    }).join(',');
                    $$ORM.repository('Shop').list({}, {id: ids}).then(function (entitys) {
                        scope.options.data = entitys;
                    });
                }

                // Ajax search
                if (type === 'placement') {
                    if (!scope.filters.appearson_id) {
                        scope.filters.filter_appearson_id = user.managesWebsite.map(function (entity) {
                            return entity.id;
                        }).join(',');
                    }
                    var config = $$autocomplete.getOptionAutocompletes(type, {}, scope.filters);
                    angular.extend(scope.options.ajax, config.ajax);
                } else if (type === 'product') {
                    if (!scope.filters.filter_isbrandedby_id) {
                        scope.filters.filter_isbrandedby_id = user.managesBrand.map(function (entity) {
                            return entity.id;
                        }).join(',');
                    }
                    var config = $$autocomplete.getOptionAutocompletes(type, {}, scope.filters);
                    angular.extend(scope.options.ajax, config.ajax);
                }
            });
        }
    };
}]);
