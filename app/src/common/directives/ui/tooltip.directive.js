'use strict';

angular.module('jDashboardFluxApp')
  .directive('tooltip', function () {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        var $ = window.$;

        $($element).hover(function () {
          // on mouseenter
          $($element).tooltip('show');
        }, function () {
          // on mouseleave
          $($element).tooltip('hide');
        });
      }
    };
  });
