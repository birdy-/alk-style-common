'use strict';

angular.module('jDashboardFluxApp').directive('alkModelProductinshopsegmentTypeSelect', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel'
        },
        require: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function (scope, elem, attrs) {
            var ProductInShopSegment = window.ProductInShopSegment;
            scope.placeholder = attrs.placeholder;
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
