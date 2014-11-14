'use strict';

describe('[Controller] ContactController', function () {

  var ContactController, $controllerProvider, scope;
  var modalInstance, user, permission, message;

  beforeEach(module('jDashboardFluxApp'));
  beforeEach(module(function(_$controllerProvider_){
    $controllerProvider = _$controllerProvider_;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _permission_) {
    scope = $rootScope.$new();
    permission = _permission_;
    user = permission.getUser();
    message = 'message';

    modalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };

    ContactController = $controller('ContactController', {
      $scope: scope,
      $modalInstance: modalInstance,
      user: user,
      message: message
    });
  }));

  it('should exist', function () {
    expect(ContactController).toBeDefined();
  });

  it('should have a record object', function () {
    expect(scope.record).toBeDefined();
    expect(typeof(scope.record)).toEqual('object');
  });

  it('should have a submit function', function () {
    expect(scope.submit).toBeDefined();
    expect(typeof(scope.submit)).toEqual('function');
  });

  it('should have a cancel function', function () {
    expect(scope.cancel).toBeDefined();
    expect(typeof(scope.cancel)).toEqual('function');
  });
});
