'use strict';

angular.module('jDashboardFluxApp').directive('alkModelProductinshopsegmentTypeSelect', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        require: 'ngModel',
        templateUrl: '/src/common/input/select-id.html',
        link: function (scope, elem, attrs) {
            scope.choices = [
                ProductInShopSegment.TYPE_AISLE,
                ProductInShopSegment.TYPE_THEMATIC,
                ProductInShopSegment.TYPE_QUERY,
                ProductInShopSegment.TYPE_PROMOTION,
                ProductInShopSegment.TYPE_NEW,
                ProductInShopSegment.TYPE_PERMISSION,
                ProductInShopSegment.TYPE_CONTACT
            ];
        }
    };
}]);
