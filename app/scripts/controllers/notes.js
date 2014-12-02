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

 	function getNotes() {
 		notes.getNotes(function(err, returnNotes) {
 			$scope.notes = returnNotes;
 		});
 	}

 	$scope.clickStar = function(starVal, starIndex) {
 		if (starVal) {
 			$scope.notes[starIndex].starred = false;
 		} else {
 			$scope.notes[starIndex].starred = true;
 		}
 	};

 	getNotes();

 });
