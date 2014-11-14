'use strict';

describe('Service: files', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var files;
  beforeEach(inject(function (_files_) {
    files = _files_;
  }));

  it('should do something', function () {
    expect(!!files).toBe(true);
  });

});
