'use strict';

describe('Directive: timelineIcon', function () {

  // load the directive's module
  beforeEach(module('phrPrototypeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<timeline-icon></timeline-icon>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the timelineIcon directive');
  }));
});
