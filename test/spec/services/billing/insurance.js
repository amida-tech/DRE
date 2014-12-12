'use strict';

describe('Service: insurance', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var insurance;
  beforeEach(inject(function (_insurance_) {
    insurance = _insurance_;
  }));

  xit('should do something', function () {
    expect(!!insurance).toBe(true);
  });

});
