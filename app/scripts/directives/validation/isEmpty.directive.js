'use strict';

angular.isEmpty = function(value) {
  return angular.isUndefined(value) || value === '' || value === null || value !== value;
}
