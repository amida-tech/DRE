'use strict';

describe('Controller: FilesUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('phrPrototypeApp'));

  var FilesUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FilesUploadCtrl = $controller('FilesUploadCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
