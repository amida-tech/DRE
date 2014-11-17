'use strict';

describe('Service: record/social', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/social;
  beforeEach(inject(function (_record/social_) {
    record/social = _record/social_;
  }));

  it('should do something', function () {
    expect(!!record/social).toBe(true);
  });

});
