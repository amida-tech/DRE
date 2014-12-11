'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('NotesCtrl', function($scope, notes) {
    
    $scope.notes = [];
    
    $scope.filters = [
        {'name': 'starred',
         'value': true
        },
        {'name': 'unStarred',
         'value': false
        },
        {'name': 'medications',
         'value': true
        },
        {'name': 'results',
         'value': true
        },
        {'name': 'encounters',
         'value': true
        },
        {'name': 'vitals',
         'value': true
        },
        {'name': 'immunizations',
         'value': true
        },
        {'name': 'allergies',
         'value': true
        },
        {'name': 'conditions',
         'value': true
        },
        {'name': 'procedures',
         'value': true
        },
        {'name': 'social',
         'value': true
        },
        {'name': 'claims',
         'value': true
        },
        {'name': 'insurance',
         'value': true
        }
    ];

    $scope.toggle = function (index) {
    	$scope.filters[index].value = !$scope.filters[index].value;
    };

    $scope.toggleAll = function () {
    	_.each($scope.filters, function(value, key, list) {
            $scope.filters[key].value = true;
    	});
    };

    //$.lockfixed(".sidebar-control",{offset: {top: 10},forcemargin: true});

    function getNotes() {
        notes.getNotes(function(err, returnNotes) {
            $scope.notes = [];
            $scope.notes = returnNotes;
        });
    }
    $scope.clickStar = function(starVal, starIndex, section) {
        var tmpSection = _.where($scope.notes, {
            'section': section
        });
        if (starVal) {
            tmpSection[0].notes[starIndex].note.starred = false;
        } else {
            tmpSection[0].notes[starIndex].note.starred = true;
        }
    };
    getNotes();
});