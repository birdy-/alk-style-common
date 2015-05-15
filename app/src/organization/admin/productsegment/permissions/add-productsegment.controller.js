'use_strict';

angular.module('jDashboardFluxApp').controller('ProductSegmentAddProductSegmentModalController', [
    '$scope', '$window', '$q','$modalInstance', 'organization', 'user', '$$sdkAuth', '$$sdkCrud',
    function ($scope, $window, $q, $modalInstance, organization, user, $$sdkAuth, $$sdkCrud) {

    	$scope.user = user;
    	$scope.newUsers = [];

    	$scope.submit = function () {
    		if ($scope.newUsers.length == 0) {
    			$scope.cancel();
    			return;
    		}

            var psUserIds = [];
            for (var i in $scope.productSegment.users)
                psUserIds.push($scope.productSegment.users[i].id);

            var promises = [];
            for (var i in $scope.newUsers) {
                // If the user already has permissions on the PS, skip him
                if (psUserIds.indexOf($scope.newUsers[i].id) >= 0)
                    continue;

                promises.push($$sdkAuth.UserManagesProductSegmentUpdate(organization.id,
                                                  $scope.productSegment.id,
                                                  $scope.newUsers[i].id,
                                                  [ProductSegment.PERMISSION_PS_SHOW]));

            }

            $q.all(promises).then(function () {
                $modalInstance.close('OK');
            })
    	};

    	$scope.cancel = function () {
	        $modalInstance.dismiss(null);
    	}

    }
]);
