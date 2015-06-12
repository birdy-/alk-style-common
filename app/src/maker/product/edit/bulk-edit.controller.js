'use_strict';

/**
 * Modal that allows the user to bulk edit lots of products.
 */
angular.module('jDashboardFluxApp')

.controller('ProductBulkEditModalController', [
    '$scope', '$modalInstance', '$$sdkCrud', 'products', 'ngToast',
    function ($scope, $modalInstance, $$sdkCrud, products, ngToast) {

    $scope.products = products;

    $scope.manufacturerFields = [
        {
            name: 'manufacturerName',
            label: 'Nom',
            value: ''
        },
        {
            name: 'manufacturerText',
            label: 'Adresse',
            value: ''
        },
        {
            name: 'manufacturerEmail',
            label: 'Email',
            value: ''
        },
        {
            name: 'manufacturerPhonenumber',
            label: 'Numéro de téléphone',
            value: ''
        },
        {
            name: 'manufacturerWebsite',
            label: 'Site internet',
            value: ''
        }
    ];

    $scope.consumerSupportFields = [
        {
            name: 'consumerSupportName',
            label: 'Nom',
            value: ''
        },
        {
            name: 'consumerSupportAddress',
            label: 'Adresse',
            value: ''
        },
        {
            name: 'consumerSupportPostcode',
            label: 'Code postal',
            value: ''
        },
        {
            name: 'consumerSupportCity',
            label: 'Ville',
            value: ''
        },
        {
            name: 'consumerSupportCountry',
            label: 'Pays',
            value: ''
        },
        {
            name: 'consumerSupportEmail',
            label: 'Email',
            value: ''
        },
        {
            name: 'consumerSupportPhonenumber',
            label: 'Numéro de téléphone',
            value: ''
        },
        {
            name: 'consumerSupportWebsite',
            label: 'Site internet',
            value: ''
        }
    ];

    $scope.compositionFields = [
        {
            name: 'composition',
            label: 'Ingrédients',
            value: ''
        },
        {
            name: 'allergens',
            label: 'Allergènes',
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

    // Need to load the selected products, the list view is not enough
    // var prefillCommonFields = function () {
    //     var fields = $scope.manufacturerFields.concat($scope.consumerSupportFields);
    //     _.map(fields, function (field) {
    //         if (isSameField($scope.products, field)) {
    //             field.value = $scope.products[0][field.name];
    //         }
    //     });
    // };

    // ------------------------------------------------------------------------
    // Event handling
    // ------------------------------------------------------------------------

    $scope.ok = function () {
        var fields = $scope.manufacturerFields.concat($scope.consumerSupportFields).concat($scope.compositionFields);
        for (var i=0 in products) {
            var product = products[i];

            for (var fieldIndex in fields) {
                var field = fields[fieldIndex];
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
                ngToast.create({
                    className: 'danger',
                    content: 'Erreur pendant la mise à jour du produit :' + message,
                    dismissOnTimeout: false,
                    dismissButton: true
                });
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
        // prefillCommonFields();
    };

    init();
}]);
