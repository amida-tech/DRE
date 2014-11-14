'use strict';

describe('Service: record/allergies', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var record/allergies;
  beforeEach(inject(function (_record/allergies_) {
    record/allergies = _record/allergies_;
  }));

  it('should do something', function () {
    expect(!!record/allergies).toBe(true);
  });

});
