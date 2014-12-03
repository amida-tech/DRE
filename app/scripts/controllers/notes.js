'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
 angular.module('phrPrototypeApp')
 .controller('NotesCtrl', function ($scope, notes) {

 	$scope.notes = [];

 	$scope.visible_sections = {
 		'allergies': true,
 		'encounters': true
 	};

 	function getNotes() {
 		notes.getNotes(function(err, returnNotes) {
 			console.log(returnNotes);
 			$scope.notes = returnNotes;
 		});
 	}

 	$scope.clickStar = function(starVal, starIndex, section) {

 		_.filter($scope.notes, {'section': section});
 		if (starVal) {
 			$scope.notes[0].notes[starIndex].starred = false;
 		} else {
 			$scope.notes[0].notes[starIndex].starred = true;
 		}
 	};

 	getNotes();

 });
