'use strict';

describe('Service: notes', function () {

  // load the service's module
  beforeEach(module('phrPrototypeApp'));

  // instantiate service
  var notes;
  beforeEach(inject(function (_notes_) {
    notes = _notes_;
  }));

  it('should do something', function () {
    expect(!!notes).toBe(true);
  });

});
