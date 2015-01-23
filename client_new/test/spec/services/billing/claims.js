'use strict';

describe('Service: claims', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var claims;
  beforeEach(inject(function (_claims_) {
    claims = _claims_;
  }));

  xit('should do something', function () {
    expect(!!claims).toBe(true);
  });

});
