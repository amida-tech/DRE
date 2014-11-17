'use strict';

describe('Controller: RecordProceduresCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordProceduresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordProceduresCtrl = $controller('RecordProceduresCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
