'use strict';

describe('Service: results', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var results;
  beforeEach(inject(function (_results_) {
    results = _results_;
  }));

  xit('should do something', function () {
    expect(!!results).toBe(true);
  });

});
