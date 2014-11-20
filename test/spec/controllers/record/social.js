'use strict';

describe('Controller: RecordSocialCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordSocialCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordSocialCtrl = $controller('RecordSocialCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
