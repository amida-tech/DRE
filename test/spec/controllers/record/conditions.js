'use strict';

describe('Controller: RecordConditionsCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordConditionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordConditionsCtrl = $controller('RecordConditionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
