'use_strict';

angular.module('jDashboardFluxApp').controller('ProductSegmentAddUserModalController', [
    '$scope', '$window', '$modalInstance', 'organization', 'productsegment', '$$sdkAuth', '$$sdkCrud', 
    function ($scope, $window, $modalInstance, organization, productsegment, $$sdkAuth, $$sdkCrud) {
    
    	$scope.productSegment = productsegment;
    	$scope.newUsers = [];

    	$scope.submit = function () {
    		if ($scope.newUsers.length == 0) {
    			$scope.cancel();
    			return;
    		}

            var psUserIds = [];
            for (var i in $scope.productSegment.users)
                psUserIds.push($scope.productSegment.users[i].id);

            var i = 0;
            while (i < $scope.newUsers.length) {
                // If the user already have a permission on the PS, we remove him from the listr
                if (psUserIds.indexOf($scope.newUsers[i]) >= 0) {
                    $scope.newUsers.slice(i, 1);
                    continue;
                }
                i++;
            }

            for (var i in $scope.newUsers) {
                $$sdkAuth.UserManagesProductSegmentUpdate(organization.id,
                                                  $scope.productSegment.id,
                                                  $scope.newUsers[i].id,
                                                  [ProductSegment.PERMISSION_PS_SHOW])
            }

            $modalInstance.close('OK');
    	};

    	$scope.cancel = function () {
	        $modalInstance.dismiss(null);
    	}

    }
]);
