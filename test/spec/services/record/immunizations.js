'use strict';

describe('Service: record/immunizations', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/immunizations;
  beforeEach(inject(function (_record/immunizations_) {
    record/immunizations = _record/immunizations_;
  }));

  it('should do something', function () {
    expect(!!record/immunizations).toBe(true);
  });

});
