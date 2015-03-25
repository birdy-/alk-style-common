'use_strict';

/**
 * Modal that allows the user to bulk edit lots of products.
 */
angular.module('jDashboardFluxApp')

.controller('ProductBulkEditModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', '$window', 'products', 'user',
    function ($scope, $modalInstance, $$sdkCrud, $window, products, user) {

    $scope.products = products;
    $scope.user = user;

    $scope.fields = [
        {
            name: 'manufacturerName',
            placeholder: 'Nom de l\'exploitant',
            value: ''
        },
        {
            name: 'manufacturerText',
            placeholder: 'Adresse de l\'exploitant',
            value: ''
        }
    ];

    // ------------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------------

    var isSameField = function (products, field) {
        var baseValue = products[0][field.name];
        return _.reduce(products, function (isSame, product) {
            return isSame && (baseValue === product[field.name]);
        }, true);
    }

    var prefillCommonFields = function () {
        _.map($scope.fields, function (field) {
            if (isSameField($scope.products, field)) {
                field.value = $scope.products[0][field.name];
                console.log(field)
            }
        });
    };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    $scope.ok = function () {
        for (var i=0 in products) {
            var product = products[i];

            for (var fieldIndex in $scope.fields) {
                var field = $scope.fields[fieldIndex];
                if (field.value) {
                    product[field.name] = field.value;
                }
            }

            $$sdkCrud.ProductUpdate(
                product, null
            ).success(function (response) {

            }).error(function (response) {
                var message = '.';
                if (response && response.message) {
                    message = ' : ' + response.message;
                }
                $window.alert("Erreur pendant la mise à jour du produit" + message);
            });
        }
        $modalInstance.close(products);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var init = function () {
        prefillCommonFields();
    };

    init();
}]);
