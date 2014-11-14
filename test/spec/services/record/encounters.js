'use strict';

describe('Service: record/encounters', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/encounters;
  beforeEach(inject(function (_record/encounters_) {
    record/encounters = _record/encounters_;
  }));

  it('should do something', function () {
    expect(!!record/encounters).toBe(true);
  });

});
