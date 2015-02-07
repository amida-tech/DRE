'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('NotesCtrl', function($scope, notes, record) {

    if (_.isEmpty(record.masterRecord) || record.recordDirty) {
        record.getData().then(function(data) {
            record.setMasterRecord(data);
            $scope.masterRecord = data;
        });
    } else {
        $scope.masterRecord = record.masterRecord;
    }

    $scope.notes = [];

    $scope.filters = [{
        'name': 'starred',
        'value': true,
        'displayName': 'starred'
    }, {
        'name': 'unStarred',
        'value': false,
        'displayName': 'un-starred'
    }, {
        'name': 'medications',
        'value': true,
        'displayName': 'medications'
    }, {
        'name': 'results',
        'value': true,
        'displayName': 'test results'
    }, {
        'name': 'encounters',
        'value': true,
        'displayName': 'encounters'
    }, {
        'name': 'vitals',
        'value': true,
        'displayName': 'vital signs'
    }, {
        'name': 'immunizations',
        'value': true,
        'displayName': 'immunizations'
    }, {
        'name': 'allergies',
        'value': true,
        'displayName': 'allergies'
    }, {
        'name': 'conditions',
        'value': true,
        'displayName': 'conditions'
    }, {
        'name': 'procedures',
        'value': true,
        'displayName': 'procedures'
    }, {
        'name': 'social',
        'value': true,
        'displayName': 'social history'
    }, {
        'name': 'claims',
        'value': true,
        'displayName': 'claims'
    }, {
        'name': 'insurance',
        'value': true,
        'displayName': 'insurance'
    }];

    $scope.toggle = function(index) {
        $scope.filters[index].value = !$scope.filters[index].value;
    };

    $scope.toggleAll = function() {
        _.each($scope.filters, function(value, key, list) {
            $scope.filters[key].value = true;
        });
    };

    //$.lockfixed(".sidebar-control",{offset: {top: 10},forcemargin: true});

    /* EXAMPLE OF NOTES DATA
    [{
        "_id": "54d503e8c053a20a26f2ee47",
        "username": "test",
        "section": "vitals",
        "entry": "54d500c1b1fca190214985f1",
        "note": "fatty fat!",
        "__v": 0,
        "star": false,
        "datetime": "2015-02-06T18:11:52.031Z"
    }, {
        "_id": "54d503ecc053a20a26f2ee48",
        "username": "test",
        "section": "vitals",
        "entry": "54d500c1b1fca190214985f1",
        "note": "fatty fat!",
        "__v": 0,
        "star": false,
        "datetime": "2015-02-06T18:11:56.350Z"
    }, {
        "_id": "54d5046bc053a20a26f2ee4b",
        "username": "test",
        "section": "allergies",
        "entry": "54d42901c1647f0000ffad24",
        "note": "love my drugs!",
        "__v": 0,
        "star": false,
        "datetime": "2015-02-06T18:14:03.991Z"
    }]

    */

    /* NOTES OBJECT

    [{
        'displaySection': 'vital signs',
        'section': 'vitals',
        'notes': [{
            'entryTitle': 'Blood pressure',
            'entrySubTitleOne': 'January 1, 2015',
            'entrySubTitleTwo': '120/80',
            'note': {
                'comment': 'too high!',
                'date': '2015-01-01',
                'starred': true
            }
        }]

    }]
    */

    //convert internal section name to display friendly spelled out name
    function displaySection(section) {
        var displayName = {
            'vitals': 'vital signs',
            'allergies': 'allergies',
            'labs': 'lab results',
            'problems': 'problems'
        }

        return displayName[section];
    }


    function mashNotesWithRecord(notes, record) {
        console.log("mashNotesWithRecord");

        //generating list of unique sections present in notes
        var notes_sections = [];
        notes_sections = _.pluck(notes, "section");
        console.log(notes_sections);
        notes_sections = _.uniq(notes_sections);
        console.log(notes_sections);

        var stub2 = []

        _.each(notes_sections, function(section) {
            var section_notes = [];

            section_notes = _.filter(notes, {
                section: section
            });
            console.log("section notes ", section, section_notes);


            var section_notes_with_entry = [];

            _.each(section_notes, function(note) {
                var result = {};
                result = {
                    'entryTitle': note.entry,
                    'note': {
                        'comment': note.note,
                        'date': note.datetime,
                        'starred': note.star
                    }
                }

                section_notes_with_entry.push(result);
            });

            var result = {
                'displaySection': displaySection(section),
                'section': section,
                'notes': section_notes_with_entry
            };

            console.log('result ', result);
            stub2.push(result);
        });


        console.log("stub2", stub2);

        console.log("DONE!")

        var stub = [{
            'displaySection': 'vital signs',
            'section': 'vitals',
            'notes': [{
                'entryTitle': 'Blood pressure',
                'entrySubTitleOne': 'January 1, 2015',
                'entrySubTitleTwo': '120/80',
                'note': {
                    'comment': 'too high!',
                    'date': '2015-01-01',
                    'starred': true
                }
            }]

        }];
        return stub2;
    }

    function getNotes() {
        notes.getNotes(function(err, returnNotes) {
            $scope.notes = mashNotesWithRecord(returnNotes, $scope.masterRecord);
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
