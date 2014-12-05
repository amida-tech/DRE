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
 		'encounters': true,
 		'immunizations': true,
 		'medications': true,
 		'conditions': true,
 		'procedures': true,
 		'vitals': true,
 		'results': true,
 		'social': true,
 		'claims': true,
 		'insurance': true
 	};

 	$scope.no_sections = false;

 	$scope.switchSections = function () {
 		var tmpCount = 0;
 		_.each($scope.visible_sections, function(entry) {
 			if (entry) {
 				tmpCount++;
 			}
 		});

 		if (tmpCount > 0) {
 			$scope.no_sections = false;
 		} else {
 			$scope.no_sections = true;
 		}
 	};

 	function getNotes() {
 		notes.getNotes(function(err, returnNotes) {
 			$scope.notes = [];
 			$scope.notes = returnNotes;
 		});
 	}

 	$scope.clickStar = function(starVal, starIndex, section) {

 		var tmpSection = _.where($scope.notes, {'section': section});

 		if (starVal) {
 			tmpSection[0].notes[starIndex].note.starred = false;
 		} else {
 			tmpSection[0].notes[starIndex].note.starred = true;
 		}
 	};

 	getNotes();

 });
