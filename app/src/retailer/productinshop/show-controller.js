'use_strict';

/**
 * Modal that allows the user to certify a given product.
 */
angular.module('jDashboardFluxApp').controller('ProductShowModalController', [
    '$scope', '$$ORM', '$modalInstance', 'product',
    function ($scope, $$ORM, $modalInstance, product) {

    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.product = null;
    // Lists all the categories
    $scope.labels = {};
    [
        18070, 18262, 18263, 18264, 18265, 18266, 18267, 18268, 18269, 18270, 18271,
        18272, 18419, 18935, 18942, 19003, 19094, 19095, 19096, 19097, 19098, 19099,
        19100, 19101, 19102, 19103, 19104, 19105, 19106, 19107, 19108, 19109, 19110,
        19111, 19112, 19113, 19114, 19121, 19122, 19122, 19123, 19124, 19125, 19126,
        19127, 19128, 19129, 19130, 19131, 19132, 19133, 19134, 19135, 19137, 19138,
        19139, 19140, 19141, 19142, 19143, 19144, 19145, 19146, 19147, 19148, 19149,
        19150, 19151, 19152, 19153, 19154, 19155, 19156, 19157, 19158, 19159, 19160,
        19161, 19162, 19163, 19164, 19165, 19166, 19167, 19168, 19169, 19170, 19171,
        10055, 10064, 10262, 10265, 10321, 10326, 10327, 10328, 10329, 10330, 10331,
        10332, 10333, 10334, 10335, 10336, 10337, 10338, 10339, 10340, 10341, 10342,
        10343, 10344, 10345, 18935, 19114, 10347
    ].map(function (labelId) {
        $scope.labels[labelId] = $$ORM.repository('Concept').lazy(labelId);
    });
    $scope.legend = {};
    [
        19195, 19196, 19058, 19059, 19060, 19061, 19062, 19063, 19064, 19065,
        19066, 19067, 19068, 19069, 19070, 19071, 19072, 19073, 19074, 18978,
        18739, 18740, 18741, 18744, 18983, 18743, 18742, 18984, 18985, 18982,
        18979, 18980, 18981, 18986, 19075, 19076, 19077, 18989, 18988, 18998,
        19078, 18994, 18992, 18996, 19000, 18991, 18999, 19079, 18990, 19080,
        18987, 19081, 19082, 19083, 18997, 19084, 18993
    ].map(function (id) {
        return $$ORM.repository('Concept').lazy(id);
    }).map(function (pnq) {
        $scope.legend[pnq.id] = pnq;
    });
    // List all the columns
    $scope.psqs = {};
    // Matrix that contains the cells
    $scope.pnqs = {};

    // ------------------------------------------------------------------------
    // Data retrievers
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // Event binding
    // ------------------------------------------------------------------------
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    // ------------------------------------------------------------------------
    // Init
    // ------------------------------------------------------------------------
    var productId = product.id;
    $scope.loading = true;
    $$ORM.repository('Product').get(productId, {isLabeledBy: true}).then(function (product) {
        $scope.product = product;
        $scope.loading = false;
    }, function (error) { $scope.loading = false; });
    $$ORM.repository('ProductStandardQuantity').list({}, {'partitions_id': productId}).then(function (psqs) {
        psqs.forEach(function (psq) {
            psq.contains.forEach(function (pnq) {
                if (!$scope.pnqs[pnq.isConceptualizedBy.id]) {
                    $scope.pnqs[pnq.isConceptualizedBy.id] = {};
                }
                $scope.pnqs[pnq.isConceptualizedBy.id][psq.id] = pnq;
            });
        });
        $scope.psqs = psqs;
    });

}]);
