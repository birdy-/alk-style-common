'use strict';

angular.module('jDashboardFluxApp').directive('alkSdkUiButtonProduct', [
    'URL_UI_BUTTON_PRODUCT', '$sce', 'md5',
    function (URL_UI_BUTTON_PRODUCT, $sce, md5) {
    return {
        restrict: 'AEC',
        scope: {
            organization: '=alkSdkUiButtonProductOrganization',
            product: '=alkSdkUiButtonProductProduct',
            placement: '=alkSdkUiButtonProductPlacement',
            campaign: '=alkSdkUiButtonProductCampaign',
            showPrice: '=alkSdkUiButtonProductShowPrice',
            showShop: '=alkSdkUiButtonProductShowShop',
            oneclick: '=alkSdkUiButtonProductOneclick'
        },
        replace: true,
        templateUrl: '/src/common/directives/ui/buttonProduct.html',
        link: function(scope, elem, attrs) {

            scope.iframe = attrs.alkSdkUiButtonProductIframe;
            scope.code = attrs.alkSdkUiButtonProductCode;

            scope.src = function() {
                var src = URL_UI_BUTTON_PRODUCT + '#/?alk=1';
                if (!scope.product
                || !scope.product.isIdentifiedBy
                || !scope.product.isIdentifiedBy.length) {
                    return '';
                }
                src += '&productreference_reference=' + scope.product.isIdentifiedBy[0].reference;
                src += '&productreference_type=' + scope.product.isIdentifiedBy[0].type;
                if (!scope.placement
                || !scope.placement.id) {
                    return '';
                }
                src += '&placement_id=' + scope.placement.id;
                if (scope.campaign
                && scope.campaign.id) {
                    src += '&campaign_id=' + scope.campaign.id;
                }
                src += '&app_id=' + scope.applicationId();
                src += '&client_id=' + scope.clientId();
                return $sce.trustAsResourceUrl(src);
            };

            scope.clientId = function() {
                if (!scope.placement
                || !scope.placement.id) {
                    return '';
                }
                if (!scope.organization
                || !scope.organization.id) {
                    return '';
                }
                return md5.createHash('alk-' + scope.placement.id +'-' + scope.organization.id);
            };

            scope.applicationId = function() {
                if (scope.organization
                && scope.organization.ua) {
                    return scope.organization.ua;
                }
                // UA based on Websites start at 3XXXXX
                if (scope.website && scope.website.id) {
                    return 'UA-3' + String("0000" + scope.website.id).slice(-5) + '-1';
                }
                // UA based on Shops start at 0XXXXX
                if (scope.shop && scope.shop.id) {
                    return 'UA-0' + String("0000" + scope.shop.id).slice(-5) + '-1';
                }
                // UA based on Organizations start at 2XXXXX
                if (scope.organization && scope.organization.id) {
                    return 'UA-2' + String("0000" + scope.organization.id).slice(-5) + '-1';
                }
                // UA based on Brand start at 4XXXXX
                if (scope.brand && scope.brand.id) {
                    return 'UA-4' + String("0000" + scope.brand.id).slice(-5) + '-1';
                }
                return '';
            };
        }
    };
}]);
