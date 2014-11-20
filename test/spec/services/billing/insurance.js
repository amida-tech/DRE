'use strict';

describe('Service: billing/insurance', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var billing/insurance;
  beforeEach(inject(function (_billing/insurance_) {
    billing/insurance = _billing/insurance_;
  }));

  it('should do something', function () {
    expect(!!billing/insurance).toBe(true);
  });

});
