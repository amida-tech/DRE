'use strict';

describe('Controller: RecordProceduresReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordProceduresReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordProceduresReviewCtrl = $controller('RecordProceduresReviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
