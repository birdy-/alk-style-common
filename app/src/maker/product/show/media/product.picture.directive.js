'use strict';

angular.module('jDashboardFluxApp').directive('selectProductpicturecontenttype', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                ProductPicture.TYPE_OF_CONTENT_UNPACKAGED,
                ProductPicture.TYPE_OF_CONTENT_PACKAGED,
                ProductPicture.TYPE_OF_CONTENT_PREPARED,
                ProductPicture.TYPE_OF_CONTENT_USED
            ];
        }
    }
}]);


angular.module('jDashboardFluxApp').directive('selectProductpicturefacedisplayed', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                ProductPicture.PRODUCT_FACE_DISPLAYED_FRONT,
                ProductPicture.PRODUCT_FACE_DISPLAYED_LEFT_SIDE,
                ProductPicture.PRODUCT_FACE_DISPLAYED_TOP,
                ProductPicture.PRODUCT_FACE_DISPLAYED_BACK,
                ProductPicture.PRODUCT_FACE_DISPLAYED_RIGHT_SIDE,
                ProductPicture.PRODUCT_FACE_DISPLAYED_BOTTOM,
                ProductPicture.PRODUCT_FACE_DISPLAYED_NA
            ];
        }
    }
}]);

angular.module('jDashboardFluxApp').directive('selectProductpictureanglehorizontal', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                ProductPicture.ANGLE_HORIZONTAL_LEFT,
                ProductPicture.ANGLE_HORIZONTAL_CENTER,
                ProductPicture.ANGLE_HORIZONTAL_RIGHT
            ];
        }
    }
}]);

angular.module('jDashboardFluxApp').directive('selectProductpictureanglevertical', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                ProductPicture.ANGLE_VERTICAL_PARALLEL,
                ProductPicture.ANGLE_VERTICAL_PLONGEANTE,
                ProductPicture.ANGLE_VERTICAL_CONTREPLONGEANTE
            ];
        }
    }
}]);

angular.module('jDashboardFluxApp').directive('selectProductpicturetransparency', [
    function () {
    return {
        restrict: 'AEC',
        scope: {
            localModel: '=ngModel',
        },
        requires: 'ngModel',
        templateUrl: '/src/common/directives/input/select-id.html',
        link: function(scope, elem, attrs) {
            scope.choices = [
                ProductPicture.TRANSPARENT,
                ProductPicture.TRANSPARENT_NOT
            ];
        }
    }
}]);
