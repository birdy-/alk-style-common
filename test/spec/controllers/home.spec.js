'use strict';

describe('[Controller] HomeController', function () {

  beforeEach(module('jDashboardFluxApp'));

  var HomeController,
    permission,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    //permission = _permission_;
    //console.log(_permission_);
    //console.log(permission);
    HomeController = $controller('HomeController', {
      $scope: scope
    });
  }));

  it('should exist', function () {
    expect(HomeController).toBeDefined();
  });
});
