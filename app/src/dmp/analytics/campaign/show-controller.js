'use strict';

angular.module('jDashboardFluxApp').controller('DmpAnalyticsCampaignShowController', [
    '$scope', '$$ORM', '$$sdkAnalytics', '$routeParams', '$$graphTools', '$window',
    function ($scope, $$ORM, $$sdkAnalytics, $routeParams, $$graphTools, $window) {

        // -----------------------------------------------------------------------------------
        // Variables
        // -----------------------------------------------------------------------------------

        // Data
        $scope.campaign = null;
        $scope.refreshInProgress = true;

        // Form formatting
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            'show-weeks': false
        };
        $scope.opened = {
            dateStart: false,
            dateEnd: false
        };
        $scope.open = function($event, which) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened[which] = true;
        };
        var now = new Date();
        $scope.request = {
            dateEnd: (new Date()).setDate(now.getDate() - 1),
            dateStart: (new Date()).setDate(now.getDate() - 31)
        };

        // Graph formatting
        $scope.graph = $$graphTools;

        // Field name helpers (variables which name is readable)
        var displaysTotal = 0;
        // var displaysUnknown = 1;
        // var displaysRetargeted = 2;
        // var clicks = 3;
        var txClicks = 1;
        var clicks = 2;
        var date = 0;
        var value = 1;

        // Day by day data
        $scope.linechartVolumes = [];
        $scope.linechartVolumes[displaysTotal] = { key: "Impressions", values: [], bar: true };
        // $scope.linechartVolumes[displaysUnknown] = { key: "Impressions Anonymes", values: [] };
        // $scope.linechartVolumes[displaysRetargeted] = { key: "Impressions Reconnues", values: [] };
        // $scope.linechartVolumes[clicks] = { key: "Clicks", values: []};
        $scope.linechartVolumes[txClicks] = { key: "Taux de clics (%)", values: []};

        // Total data
        $scope.totalViews = 0;
        $scope.totalClicks = 0;
        // $scope.totalRetargeted = 0;
        $scope.totalLeads = 0;
        $scope.cartItems = [];

        // Ratio data
        // $scope.txRetargeted = { key: "% reconnus", values: [] };
        $scope.clicks = { key: "clics", values: [] };
        $scope.txClick = { key: "% clics", values: [] };
        // $scope.txLeadRetargeted = { key: "% leads reconnus", values: [] };

        // -----------------------------------------------------------------------------------
        // Data retrievers
        // -----------------------------------------------------------------------------------
        var load = function (placementId, dateStart, dateEnd) {
            $$sdkAnalytics.AnalyticsWebsitePlacementPerformance(
                placementId,
                ['clicks', 'leads', 'pageviews', 'rpageviews', 'urpageviews'],
                dateStart,
                dateEnd
            ).then(format, function (error) {
                console.log(error);
                $scope.refreshInProgress = false;
                $scope.noData = true;
            });
        };

        var format = function (response) {
            // Helpers
            var byDate = function (a, b) {return a[date] - b[date]; };
            var dateValuePair = function (point) {
                return [(new Date(point.date)).getTime(), point.value]; };
            var sumValue = function (prev, current) {return current.value + prev; };
            var convertToPoint = function (point) { return {date: point[0], value: parseFloat(point[1])}; };
            var computeRatio = function (precision, compareTo) {
                return function (values, i) {
                    if (values[date] !== $scope.linechartVolumes[compareTo].values[i][date]) {
                        $window.alert('Erreur de synchronisation des dates. Merci de contacter le support.');
                    }
                    var tx = (100 * values[value] / $scope.linechartVolumes[compareTo].values[i][value]).toFixed(precision);
                    return [values[date], tx];
                };
            };

            // Day by day data
            $scope.linechartVolumes[displaysTotal].values = response.data.pageviews.map(dateValuePair).sort(byDate);
            // $scope.linechartVolumes[displaysUnknown].values = response.data.urpageviews.map(dateValuePair).sort(byDate);
            // $scope.linechartVolumes[displaysRetargeted].values = response.data.rpageviews.map(dateValuePair).sort(byDate);
            // $scope.linechartVolumes[clicks].values = response.data.clicks.map(dateValuePair).sort(byDate);
            $scope.linechartVolumes[txClicks].values = response.data.clicks.map(dateValuePair).sort(byDate);

            // Totals data
            $scope.totalClicks = response.data.clicks.reduce(sumValue, 0);
            $scope.totalViews = response.data.pageviews.reduce(sumValue, 0);
            // $scope.totalRetargeted = response.data.rpageviews.reduce(sumValue, 0);
            // $scope.totalLeads = response.data.leads.reduce(sumValue, 0);

            // Ratios data
            // $scope.txRetargeted.values = $scope.linechartVolumes[displaysRetargeted].values.map(computeRatio(2, displaysTotal));
            $scope.clicks.values = response.data.clicks.map(dateValuePair).sort(byDate);
            $scope.txClick.values = $scope.clicks.values.map(computeRatio(2, displaysTotal));
            $scope.linechartVolumes[txClicks].values = $scope.txClick.values.map(convertToPoint).map(dateValuePair).sort(byDate);
            // $scope.txLeadRetargeted.values = $scope.linechartVolumes[leads].values.map(computeRatio(2, displaysRetargeted));

            $scope.refreshInProgress = false;
            $scope.noData = false;
        };

        // -----------------------------------------------------------------------------------
        // Event listenning
        // -----------------------------------------------------------------------------------
        $scope.refresh = function () {
            $scope.refreshInProgress = true;
            // @todo : for now, the analytics are by placement, not by campaign
            var placementId = $scope.campaign.runsIn[0].id;
            load(placementId, $scope.request.dateStart, $scope.request.dateEnd);
        };

        // -----------------------------------------------------------------------------------
        // Init
        // -----------------------------------------------------------------------------------
        var init = function () {
            $$ORM.repository('Campaign').get($routeParams.id).then(function (campaign) {
                $scope.campaign = campaign;
                $scope.refresh();
            });
        };
        init();
    }
]);
