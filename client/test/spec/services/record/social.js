'use strict';

describe('Service: social', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var social;
  beforeEach(inject(function (_social_) {
    social = _social_;
  }));

  xit('should do something', function () {
    expect(!!social).toBe(true);
  });

});
