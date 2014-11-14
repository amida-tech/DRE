'use strict';

describe('Directive: recordNavigation', function () {

  // load the directive's module
  beforeEach(module('phrPrototypeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<record-navigation></record-navigation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the recordNavigation directive');
  }));
});
