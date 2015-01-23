'use strict';

describe('Service: immunizations', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var immunizations;
  beforeEach(inject(function (_immunizations_) {
    immunizations = _immunizations_;
  }));

  xit('should do something', function () {
    expect(!!immunizations).toBe(true);
  });

});
