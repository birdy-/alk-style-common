'use strict';

describe('[Controller] HomeController', function () {

  beforeEach(module('jDashboardFluxApp'));

  var HomeController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    HomeController = $controller('HomeController', {
      $scope: scope
    });
  }));

  it('should exist', function () {
    expect(HomeController).toBeDefined();
  });

  it('should have a user object', function () {
    expect(scope.user).toBeDefined();
    expect(typeof(scope.user)).toEqual('object');
  });

  it('should have a subscribe function', function () {
    expect(scope.subscribe).toBeDefined();
    expect(typeof(scope.subscribe)).toEqual('function');
  });
});
