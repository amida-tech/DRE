'use strict';

describe('Controller: RecordDownloadCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var RecordDownloadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecordDownloadCtrl = $controller('RecordDownloadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
