'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductInShopSegmentEditModalController', [
    '$scope', '$$ORM', 'permission', '$modalInstance', 'productInShopSegment',
    function ($scope, $$ORM, permission, $modalInstance, productInShopSegment) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.segment = null;
    $scope.belongings = [];
    $scope.user = null;

    // ------------------------------------------------------------------------
    // Data retrievers
    // ------------------------------------------------------------------------
    var get = function (id) {
        $$ORM.repository('ProductInShopSegment').get(id).then(function (segment) {
            angular.forEach(segment.belongings, function (item, key) {
                if ($scope.belongings.length < key) {
                    $scope.belongings.push(item);
                } else {
                    $scope.belongings[key] = item;
                }
            });
            $scope.segment = segment;
        });
    };
    var create = function () {
        var segment = ProductInShopSegment();
        segment.type = ProductInShopSegment.TYPE_CONTACT.id;
        segment.belongings = [];
        segment.createdIn = $scope.user.managesShop[0];
        segment.createdBy = $scope.user;
        $scope.segment = segment;
    };

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.save = function () {
        // Eliminate forbidden values
        $scope.segment.belongings = $scope.belongings.filter(function (item) {
            return item.reference && item.reference.length > 0;
        });
        $scope.segment.query = $scope.segment.belongings.map(function (item) {
            return {filter_reference_reference: item.reference, filter_reference_type: 'EAN13'};
        });
        $$ORM.repository('ProductInShopSegment').update($scope.segment).then(function () {
            $modalInstance.close();
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function () {
        if (productInShopSegment && productInShopSegment.id) {
            get(productInShopSegment.id);
        } else {
            create();
        }
    };
    permission.getUser().then(function (user) {
        $scope.user = user;
        init();
    });

}]);
