'use strict';

angular.module('jDashboardFluxApp').directive('alkSdkUiLandingpage', [
    'URL_UI_LANDINGPAGE', '$sce', 'md5', '$log',
    function (URL_UI_LANDINGPAGE, $sce, md5, $log) {
    return {
        restrict: 'AEC',
        scope: {
            organization: '=alkSdkUiLandingpageOrganization',
            product: '=alkSdkUiLandingpageProduct',
            campaign: '=alkSdkUiLandingpageCampaign',
            placement: '=alkSdkUiLandingpagePlacement'
        },
        replace: true,
        templateUrl: '/src/common/directives/ui/landingPage.html',
        link: function(scope, elem, attrs) {

            scope.iframe = attrs.alkSdkUiLandingpageIframe;
            scope.code = attrs.alkSdkUiLandingpageCode;

            // https://sassets.toc.io/interfaces/landing-page-product/v1/index.html#/
            // ?productreference_reference=7613034056122
            // &productreference_type=ean13
            // &placement_id=1241
            // &app_id=UA-0000-0
            // &client_id=toto
            scope.src = function() {
                var src = URL_UI_LANDINGPAGE + '#/?alk=1';
                if (!scope.product
                || !scope.product.isIdentifiedBy
                || !scope.product.isIdentifiedBy.length) {
                    $log.warn('Missing product.isIdentifiedBy');
                    return '';
                }
                src += '&productreference_reference=' + scope.product.isIdentifiedBy[0].reference;
                src += '&productreference_type=' + scope.product.isIdentifiedBy[0].type;
                if (!scope.placement
                || !scope.placement.id) {
                    $log.warn('Missing placement');
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
