'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
  .service('notes', function notes(allergies) {
    
  	var getNotes = function (callback) {

  		var tmpNotes = [];

  		allergies.getRecordMeta (function(err, allergiesMeta) {
  			tmpNotes = tmpNotes.concat(allergiesMeta.comments);
  			callback(null, tmpNotes);
  		});
  	};

  	this.getNotes = getNotes;

  });
