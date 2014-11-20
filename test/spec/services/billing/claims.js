'use strict';

describe('Service: billing/claims', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var billing/claims;
  beforeEach(inject(function (_billing/claims_) {
    billing/claims = _billing/claims_;
  }));

  it('should do something', function () {
    expect(!!billing/claims).toBe(true);
  });

});
