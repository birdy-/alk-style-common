"use strict";

angular.module('jDashboardFluxApp').directive('buttonSave', function($compile) {
    return {
        restrict: 'AEC',
        transclude: false,
        scope: {
            'form': '='
            //'innerClick': '&ng-click',
        },
        templateUrl: '/src/common/directives/validation/button-save.html',
        link: function(scope, element, attrs, ctrl) {
            scope['class'] = attrs.buttonClass;
        }
    };
});
