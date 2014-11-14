'use strict';

describe('Controller: RecordEncountersCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordEncountersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordEncountersCtrl = $controller('RecordEncountersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
