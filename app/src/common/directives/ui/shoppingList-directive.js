'use strict';

angular.module('jDashboardFluxApp').directive('alkSdkUiShoppinglist', [
    'URL_UI_SHOPPINGLIST', '$sce', 'md5',
    function (URL_UI_SHOPPINGLIST, $sce, md5) {
    return {
        restrict: 'AEC',
        scope: {
            placement: '=alkSdkUiShoppinglistPlacement',
            organization: '=alkSdkUiShoppinglistOrganization',
            recipe: '=alkSdkUiShoppinglistRecipe',
            campaign: '=alkSdkUiShoppinglistCampaign',
            website: '=alkSdkUiShoppinglistWebsite'
        },
        replace: true,
        templateUrl: '/src/common/directives/ui/shoppingList.html',
        link: function(scope, elem, attrs) {

            scope.iframe = attrs.alkSdkUiShoppinglistIframe;
            scope.code = attrs.alkSdkUiShoppinglistCode;

            // http://assets.toc.io/interfaces/banner/v3/index.html#/
            // ?Recipe_urlRecipes=http%3A%2F%2Fwww.marmiton.org%2Frecettes%2Frecette_paupiettes-de-veau-aux-oignons-et-tomates_17872.aspx
            // &css_background=ED6B06
            // &app_id=UA-1022-1
            scope.src = function() {
                var src = URL_UI_SHOPPINGLIST + '#/?alk=1';
                if (!scope.recipe
                || !scope.recipe.isDescribedOn
                || !scope.recipe.isDescribedOn.url) {
                    return '';
                }
                src += '&Recipe_urlRecipes=' + scope.recipe.isDescribedOn.url;
                if (!scope.placement
                || !scope.placement.id) {
                    return;
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
                if (!scope.placement) {
                    return '';
                }
                if (!scope.organization) {
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
                if (scope.website) {
                    return 'UA-3' + String("0000" + scope.website.id).slice(-5) + '-1';
                }
                // UA based on Shops start at 0XXXXX
                if (scope.shop) {
                    return 'UA-0' + String("0000" + scope.shop.id).slice(-5) + '-1';
                }
                // UA based on Organizations start at 2XXXXX
                if (scope.organization) {
                    return 'UA-2' + String("0000" + scope.organization.id).slice(-5) + '-1';
                }
                // UA based on Brand start at 4XXXXX
                if (scope.brand) {
                    return 'UA-4' + String("0000" + scope.brand.id).slice(-5) + '-1';
                }
            };
        }
    };
}]);
