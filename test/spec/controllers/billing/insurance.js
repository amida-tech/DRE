'use strict';

describe('Controller: BillingInsuranceCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var BillingInsuranceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillingInsuranceCtrl = $controller('BillingInsuranceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
