'use strict';

describe('Controller: RecordAllergiesCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordAllergiesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordAllergiesCtrl = $controller('RecordAllergiesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
