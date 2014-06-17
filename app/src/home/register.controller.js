
angular.module('jDashboardFluxApp').controller('RegisterCtrl', [
    '$scope', '$$sdkCrud', '$location',
    function ($scope, $$sdkCrud, $location) {
        $scope.user = {
            login: null,
            password: null,
            rcs: null,
            accept: false,
        };
        $scope.ok = false;
        $scope.message = null;
        $scope.submit = function() {
            $$sdkCrud.UserCreate($scope.user).success(function(response){
                $scope.ok = true;
            }).error(function(response){
                $scope.ok = false;
                $scope.message = "Une erreur a eu lieu pendant votre inscription, merci de réessayer ultérieurement.";
            });
        };
    }
]);