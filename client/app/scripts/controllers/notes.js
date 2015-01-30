'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('NotesCtrl', function($scope, notes, profile) {
    
    $scope.notes = [];
    
    $scope.filters = [
        {'name': 'starred',
         'value': true,
         'displayName': 'starred'
        },
        {'name': 'unStarred',
         'value': false,
         'displayName': 'un-starred'
        },
        {'name': 'medications',
         'value': true,
         'displayName': 'medications'
        },
        {'name': 'results',
         'value': true,
         'displayName': 'test results'
        },
        {'name': 'encounters',
         'value': true,
         'displayName': 'encounters'
        },
        {'name': 'vitals',
         'value': true,
         'displayName': 'vital signs'
        },
        {'name': 'immunizations',
         'value': true,
         'displayName': 'immunizations'
        },
        {'name': 'allergies',
         'value': true,
         'displayName': 'allergies'
        },
        {'name': 'conditions',
         'value': true,
         'displayName': 'conditions'
        },
        {'name': 'procedures',
         'value': true,
         'displayName': 'procedures'
        },
        {'name': 'social',
         'value': true,
         'displayName': 'social history'
        },
        {'name': 'claims',
         'value': true,
         'displayName': 'claims'
        },
        {'name': 'insurance',
         'value': true,
         'displayName': 'insurance'
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

    function showUserInfo() {
        profile.getProfile(function(err, profileInfo) {
            $scope.user_first = profileInfo.name.first;
            $scope.user_last = profileInfo.name.last;
            $scope.user_email = profileInfo.email[0].email;
            $scope.user_dob = profileInfo.dob;
        });
    }

    showUserInfo();

    getNotes();
});