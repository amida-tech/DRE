'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('NotesCtrl', function($scope, notes, record, format) {
    $scope.any_sections_selected = false;

    $scope.notes = [];

    $scope.filters = [{
        'name': 'starred',
        'value': true,
        'displayName': 'starred'
    }, {
        'name': 'unStarred',
        'value': true,
        'displayName': 'un-starred'
    }];



    //gets notes from backend API
    function getNotes() {
        notes.getNotes(function(err, returnNotes) {
            $scope.notes = mashNotesWithRecord(returnNotes, $scope.masterRecord);
            $scope.filters = updateFilters(returnNotes);
            updateAnySectionsSelected();
        });
    }


    if (_.isEmpty(record.masterRecord) || record.recordDirty) {
        record.getData(function(err, data) {
            if (err) {
                console.log("getData error ", err);
            } else {
                console.log("MASTER RECORD is Loaded!");
                record.setMasterRecord(data);

                $scope.masterRecord = data.records;

                record.processRecord(data.records, $scope.notes, "notes.js controller");
                console.log("PROCESSED MASTER RECORD ", record.processedRecord);


                getNotes();
            }
        });
    } else {
        console.log("ELSE - in loading record");
        $scope.masterRecord = record.masterRecord;

        getNotes();
    }


    //updated flag that says if any sections are selected to view
    function updateAnySectionsSelected() {
        $scope.any_sections_selected = false;

        _.each($scope.filters, function(filter) {
            if (filter.name !== "starred" && filter.name !== "unStarred" && filter.value) {
                $scope.any_sections_selected = true;
            }

        });
    }

    $scope.toggle = function(index) {
        $scope.filters[index].value = !$scope.filters[index].value;
        //calculate if no sections are selected
        updateAnySectionsSelected();

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


    function titles(scope) {
        scope.entryTitle = "";
        scope.entrySubTitleOne = "";
        scope.entrySubTitleTwo = "";

        var entry = scope.entryData;
        console.log("TITLES: ", entry);
        var tmpDates = [];
        var dispDates = "Not Available";

        if (!_.isUndefined(entry.date_time)) {
            if (!_.isUndefined(entry.date_time.point)) {
                tmpDates = [entry.date_time.point];
            } else if (!_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
                tmpDates = [entry.date_time.low, entry.date_time.high];
            } else if (!_.isUndefined(entry.date_time.low) && _.isUndefined(entry.date_time.high)) {
                tmpDates = [entry.date_time.low];
            } else if (_.isUndefined(entry.date_time.low) && !_.isUndefined(entry.date_time.high)) {
                tmpDates = [entry.date_time.high];
            }
        }

        if (!_.isUndefined(entry.results) && entry.results.length > 0) {
            if (!_.isUndefined(entry.results[0].date_time.point)) {
                tmpDates = [entry.results[0].date_time.point];
            } else if (!_.isUndefined(entry.results[0].date_time.low) && !_.isUndefined(entry.results[0].date_time.high)) {
                tmpDates = [entry.results[0].date_time.low, entry.results[0].date_time.high];
            } else if (!_.isUndefined(entry.results[0].date_time.low) && _.isUndefined(entry.results[0].date_time.high)) {
                tmpDates = [entry.results[0].date_time.low];
            } else if (_.isUndefined(entry.results[0].date_time.low) && !_.isUndefined(entry.results[0].date_time.high)) {
                tmpDates = [entry.results[0].date_time.high];
            }
        }

        if (tmpDates.length === 1) {
            dispDates = format.formatDate(tmpDates[0]);
        } else if (tmpDates.length === 2) {
            dispDates = format.formatDate(tmpDates[0]) + ' - ' + format.formatDate(tmpDates[1]);
        }

        scope.recordEntry.metadata.displayDate = dispDates;


        switch (scope.type) {
            case 'allergies':
                if (scope.entryData.observation) {
                    if (scope.entryData.observation.allergen && scope.entryData.observation.allergen.name) {
                        scope.entryTitle = scope.entryData.observation.allergen.name;
                    }
                    if (scope.entryData.observation.severity && scope.entryData.observation.severity.code && scope.entryData.observation.severity.code.name) {
                        scope.entrySubTitleOne = scope.entryData.observation.severity.code.name;
                    }
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'encounters':
                if (scope.entryData.encounter && scope.entryData.encounter.name) {
                    scope.entryTitle = scope.entryData.encounter.name;
                }
                if (scope.entryData.locations && scope.entryData.locations[0].name) {
                    scope.entrySubTitleOne = scope.entryData.locations[0].name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'immunizations':
                if (scope.entryData.product && scope.entryData.product.product && scope.entryData.product.product.name) {
                    scope.entryTitle = scope.entryData.product.product.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'medications':
                if (scope.entryData.product && scope.entryData.product.product && scope.entryData.product.product.name) {
                    scope.entryTitle = scope.entryData.product.product.name;
                }
                if (scope.entryData.administration && scope.entryData.administration.route && scope.entryData.administration.route.name) {
                    scope.entrySubTitleOne = scope.entryData.administration.route.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'conditions':
                if (scope.entryData.problem && scope.entryData.problem.code && scope.entryData.problem.code.name) {
                    scope.entryTitle = scope.entryData.problem.code.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'procedures':
                if (scope.entryData.procedure && scope.entryData.procedure.name) {
                    scope.entryTitle = scope.entryData.procedure.name;
                }
                if (scope.entryData.status) {
                    scope.entrySubTitleOne = scope.entryData.status;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'vitals':
                var quantityUnit = "";
                if (scope.entryData.unit) {
                    if (scope.entryData.unit === "[in_i]") {
                        quantityUnit = "inches";
                    } else if (scope.entryData.unit === "[lb_av]") {
                        quantityUnit = "lbs";
                    } else if (scope.entryData.unit === "mm[Hg]") {
                        quantityUnit = "mm";
                    } else {
                        quantityUnit = scope.entryData.unit;
                    }
                    if (scope.entryData.value && scope.entryData.value + " " + quantityUnit) {
                        scope.entryTitle = scope.entryData.value + " " + quantityUnit;
                    }
                }
                if (scope.entryData.vital && scope.entryData.vital.name) {
                    scope.entrySubTitleOne = scope.entryData.vital.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'results':
                if (scope.entryData.result_set && scope.entryData.result_set.name) {
                    scope.entryTitle = scope.entryData.result_set.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'social':
                if (scope.entryData.value) {
                    scope.entryTitle = scope.entryData.value;
                }
                if (scope.entryData.code && scope.entryData.code.name) {
                    scope.entrySubTitleOne = scope.entryData.code.name;
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'claims':
                if (scope.entryData.payer[0]) {
                    scope.entryTitle = scope.entryData.payer[0];
                }
                if (scope.recordEntry.metadata.displayDate) {
                    scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                }
                break;
            case 'insurance':
                if (scope.entryData.name) {
                    scope.entryTitle = scope.entryData.name;
                }
                if (scope.entryData.date_time) {
                    scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                }
                break;
        }

        return scope;
    }

    //convert internal section name to display friendly spelled out name
    function displaySection(section) {
        var displayName = {
            'vitals': 'vital signs',
            'results': 'test results',
            'social': 'social history'
        };

        if (displayName[section]) {
            return displayName[section];
        } else {
            return section;
        }
    }


    function mashNotesWithRecord(notes, record) {
        console.log("mashNotesWithRecord ", notes, record);

        //generating list of unique sections present in notes
        var notes_sections = [];
        notes_sections = _.pluck(notes, "section");
        notes_sections = _.uniq(notes_sections);

        var stub2 = [];

        _.each(notes_sections, function(section) {
            switch (section) {
                case "conditions":
                    section = "problems";
                    break;
                case "social":
                    section = "social_history";
                    break;
            }

            var section_notes = [];

            section_notes = _.filter(notes, {
                section: section
            });

            var section_notes_with_entry = [];

            _.each(section_notes, function(note) {
                var result = {};
                result = {
                    'entryTitle': note.entry,
                    'entrySubTitleOne': '',
                    'entrySubTitleTwo': '',
                    'entry_id': note.entry,
                    'note': {
                        'comment': note.note,
                        'date': note.datetime,
                        'starred': note.star,
                        'note_id': note._id
                    }
                };


                var ff = _.where(record[section], {
                    '_id': note.entry
                })[0];

                if (!ff) {
                    console.log("BAAAD!!!!!", section);
                    ff = {};
                }

                var entry_data = {
                    entryData: ff,
                    type: section,
                    recordEntry: {
                        metadata: {}
                    }
                };


                var tttt = titles(entry_data);

                result.entryTitle = tttt.entryTitle;
                result.entrySubTitleOne = tttt.entrySubTitleOne;
                result.entrySubTitleTwo = tttt.entrySubTitleTwo;

                section_notes_with_entry.push(result);
            });

            var result = {
                'displaySection': displaySection(section),
                'section': section,
                'notes': section_notes_with_entry
            };

            stub2.push(result);
        });

        return stub2;
    }

    //updates list of sections in filters based on what sections are present in notes
    function updateFilters(notes) {
        var filters = $scope.filters;

        //generating list of unique sections present in notes
        var notes_sections = [];
        notes_sections = _.pluck(notes, "section");
        notes_sections = _.uniq(notes_sections);

        _.each(notes_sections, function(section) {
            filters.push({
                'name': section,
                'value': true,
                'displayName': displaySection(section)
            });
        });


        return filters;
    }


    $scope.clickStar = function(starVal, starIndex, section, entry) {
        console.log("click Star ", !starVal, starIndex, section, entry);

        notes.starNote(entry.note.note_id, !starVal, function(err, data) {
            console.log('err ', err);
            console.log('updated note ', data);
        });


        var tmpSection = _.where($scope.notes, {
            'section': section
        });
        if (starVal) {
            tmpSection[0].notes[starIndex].note.starred = false;
        } else {
            tmpSection[0].notes[starIndex].note.starred = true;
        }


    };

});
