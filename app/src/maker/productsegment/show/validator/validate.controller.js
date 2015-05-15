'use_strict';

angular.module('jDashboardFluxApp').controller('ProductSegmentValidatorController', [
    '$scope', '$$sdkCrud', '$$sdkAuth', '$$sdkGdsn','$routeParams', '$$autocomplete', '$location', '$window', 'URL_CDN_MEDIA', '$modal', 'permission',
    function ($scope, $$sdkCrud, $$sdkAuth, $$sdkGdsn, $routeParams, $$autocomplete, $location, $window, URL_CDN_MEDIA, $modal, permission) {

	// ------------------------------------------------------------------------
    // Route params
    // ------------------------------------------------------------------------
    $scope.productSegmentId = $routeParams.id;
    // for dev demo
    $scope.dev = typeof($routeParams.dev) !== 'undefined';


    // ------------------------------------------------------------------------
    // Variables
    // ------------------------------------------------------------------------
    $scope.request = {
    	limit: 24,
    	offset: 0
    };

   	$scope.productSegment = {};
   	$scope.products = [];
    $scope.glns = [];

    $scope.display = {
    	allSelected : false,
    	selection : false
    };

    $scope.picked = null;

    // ------------------------------------------------------------------------
    // EventHandling
    // ------------------------------------------------------------------------
    $scope.refreshSelection = function (all) {
    	if (all && $scope.display.allSelected == true) {
    		$scope.products.map(function (product) {
    			product.selected = true;
    		});
    		$scope.display.selection = true;
    		return;
    	}
    	if (all && $scope.display.allSelected == false) {
    		$scope.products.map(function (product) {
    			product.selected = false;
    		});
    		$scope.display.selection = false;
    		return;
    	}
  		var k = 0;
   		for (var i = 0, len = $scope.products.length; i < len; i++) {
   			if ($scope.products[i].selected === true) {
   				$scope.display.selection = true;
   				return;
   			}
    	}
    	$scope.display.selection = false;
    };

    // Navigation
    $scope.prev = function () {
        $scope.request.offset = Math.max($scope.request.offset - $scope.request.limit, 0);
        loadPendingProducts();
    };

    $scope.next = function() {
        $scope.request.offset = $scope.request.offset + $scope.request.limit;
        loadPendingProducts();
    };

    // ------------------------------------------------------------------------
    // UserActions
    // ------------------------------------------------------------------------
    $scope.batch = function (callback) {
        $scope.products.map(function (product) {
            if (product.selected === true)
                callback(product);
        });
    };

    $scope.check = function (product) {
        if (typeof(product.isBrandedBy) === 'undefined'
                || product.isBrandedBy === null
                || product.isBrandedBy === {}
                || typeof(product.isBrandedBy.id) === 'undefined') {
            $window.alert('Validation du produit ' + product.isIdentifiedBy[0].reference + ' impossible: Marque invalide');
            return false;
        }
        if (typeof(product.gln) === 'undefined'
                || product.gln === null) {
            $window.alert('Validation du produit ' + product.isIdentifiedBy[0].reference + ' impossible: GLN invalide');
            return false;
        }
        return true;
    };

    $scope.validate = function (product) {
        if ($scope.check(product) == false) {
            return;
        }
        $$sdkAuth.UserClaimProductReferenceCreate(product.namePublicLong, product.isIdentifiedBy[0].reference, product.isBrandedBy.id, product.gln).then(
            function (response) {
                product.isActivated = true;
            },
            function (response ) {
                $window.alert('Product activation failed.');
            });
    };

    $scope.evict = function (product) {
        // remove product from productsegment
    };


    $scope.pickBrand = function (product) {
        product.isBrandedBy = $scope.picked;
    };

    $scope.pickGLN = function (product) {
        product.gln = $scope.picked;
    };


    $scope.picker = function (type, data) {
        var modalInstance = $modal.open({
            templateUrl: 'src/maker/productsegment/show/validator/' + type + 'picker.html',
            controller: 'ProductSegmentValidatorPickerController',
            resolve: {
                data: function() { return data; }
            }
        });

        modalInstance.result.then(function (result) {
            $scope.picked = result;
            if (type === 'brand')
                $scope.batch($scope.pickBrand);
            if (type === 'gln')
                $scope.batch($scope.pickGLN);
        });
    };


    // ------------------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------------------
    var loadProductSegment = function () {
    	$$sdkCrud.ProductSegmentShow($scope.productSegmentId).then(function (response) {
    		$scope.productSegment = response.data.data;

            $scope.productSegment.glns = [];
            $scope.productSegment.query.map(function (query) {
                if (typeof(query.filter_glns) !== 'undefined') {
                    query.filter_glns.map(function (gln) {
                        $scope.productSegment.glns.push(gln);
                        $scope.glns.push(gln);
                    });
                }
            });
            loadPendingProducts();
        });
    };

    var loadGLNs = function (product) {
        product.glns = $scope.productSegment.glns;
        var filters = {
            'filter_ean': product.isIdentifiedBy[0].reference,
            'filter_type': '9'
        };
        $$sdkGdsn.GdsnGLNList({}, filters, {}, null, null).then(function (response) {
            var result = response.data.data;
            result.map(function (gln) {
                if (product.glns.indexOf(gln.gln) == -1)
                    product.glns.push(gln.gln);
                if ($scope.glns.indexOf(gln.gln) == -1)
                    $scope.glns.push(gln.gln);
            });
            product.gln = product.glns[0];
        });
    };

    var loadPendingProducts = function() {
    	var filters = {
    		'productsegment_id': $scope.productSegmentId,
       		'certified': '0,3,4,6'
    	};
    	$$sdkCrud.ProductList({}, filters, {}, $scope.request.offset, $scope.request.limit, {}).then(function (response) {
    		$scope.products = response.data.data;
    		$scope.products.map(function (product) {
                // Product Brand should not appear
                if (product.isBrandedBy.id === 1)
                    product.isBrandedBy = null;
                // directive prints the text value
                else
        			product.isBrandedBy.text = product.isBrandedBy.name;
    		    loadGLNs(product);
            });
    	});
    };


    var init = function() {
    	loadProductSegment();
    };
    init();

}]);
