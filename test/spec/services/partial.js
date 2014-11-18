'use strict';

describe('Service: partial', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var partial;
  beforeEach(inject(function (_partial_) {
    partial = _partial_;
  }));

  it('should do something', function () {
    expect(!!partial).toBe(true);
  });

});
