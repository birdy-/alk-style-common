'use strict';

angular.module('jDashboardFluxApp').directive('alkSdkUiButtonProduct', [
    'URL_UI_BUTTON_PRODUCT', '$sce',
    function (URL_UI_BUTTON_PRODUCT, $sce) {
    return {
        restrict: 'AEC',
        scope: {
            organization: '=',
            product: '=',
            showPrice: '=',
            showShop: '=',
            oneclick: '='
        },
        replace: true,
        templateUrl: '/src/common/directives/ui/buttonProduct.html',
        link: function(scope, elem, attrs) {

            var seed = function(s) {
                s = Math.sin(s) * 10000;
                return String(s - Math.floor(s)).substring(2, 14);
            };

            scope.iframe = attrs.iframe;
            scope.code = attrs.code;
            scope.client = {
                id: null
            };
            scope.application = {
                id: null
            };

            scope.src = function() {
                var src = URL_UI_BUTTON_PRODUCT + '#/?placement_id=1234&app_id=323&client_id=3283';
                if (scope.product
                && scope.product.isIdentifiedBy
                && scope.product.isIdentifiedBy.length) {
                    src += '&productreference_reference=' + scope.product.isIdentifiedBy[0].reference;
                    src += '&productreference_type=' + scope.product.isIdentifiedBy[0].type;
                }
                return $sce.trustAsResourceUrl(src);
            };
            scope.$watch('organization', function(){
                if (!scope.organization) {
                    return;
                }
                // Quick and direty way to invent an accountId
                if (!scope.organization.accountId) {
                    scope.client.id = seed(scope.organization.id);
                } else {
                    scope.client.id = scope.organization.accountId;
                }
                // UA based on organizations start at 2XXXXX
                if (!scope.organization.ua) {
                    scope.application.id = 'UA-2' + String("0000" + scope.organization.id).slice(-5) + '-1';
                } else {
                    scope.application.id = scope.organization.ua;
                }
            }, true);
        }
    };
}]);
