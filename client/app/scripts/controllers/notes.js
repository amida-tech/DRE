'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('NotesCtrl', function ($scope, $location, notes, format, dataservice) {
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

    $scope.setEntry = function (section, entryId) {
        console.log("set entry type for my record view ", section.section);
        //dataservice.curr_section = section;
        //dataservice.curr_location = entryId;
        if (section === 'insurance' || section === 'claims') {
            $location.path('/billing/' + section);
        } else {
            $location.path('/record/' + section);
        }
    };

    $scope.dateSort = function () {
        console.log('old predicate ' + $scope.predicate);
        if ($scope.predicate === '') {
            $scope.predicate = 'date';
        } else {
            $scope.predicate = '';
        }
        console.log('new predicate ' + $scope.predicate);
    };

    dataservice.retrieveMasterRecord(function (err, master) {
        if (err) {
            console.log("err: ", err);
        } else {
            $scope.masterRecord = master;
            notes.getNotes(function (err2, notes) {
                if (err2) {
                    console.log("err2: ", err2);
                } else {
                    $scope.notes = mashNotesWithRecord(notes, master);
                    $scope.filters = updateFilters(notes);
                    updateAnySectionsSelected();
                }
            });
        }
    });

    //updates list of sections in filters based on what sections are present in notes
    function updateFilters(notes) {
        var filters = $scope.filters;
        //generating list of unique sections present in notes
        var notes_sections = [];
        notes_sections = _.pluck(notes, "section");
        notes_sections = _.uniq(notes_sections);
        _.each(notes_sections, function (section) {
            filters.push({
                'name': section,
                'value': true,
                'displayName': displaySection(section)
            });
        });
        return filters;
    }

    //updated flag that says if any sections are selected to view
    function updateAnySectionsSelected() {
        $scope.any_sections_selected = false;
        _.each($scope.filters, function (filter) {
            if (filter.name !== "starred" && filter.name !== "unStarred" && filter.value) {
                $scope.any_sections_selected = true;
            }
        });
    }

    $scope.toggle = function (index) {
        $scope.filters[index].value = !$scope.filters[index].value;
        //calculate if no sections are selected
        updateAnySectionsSelected();
        $scope.checkNotes();
    };

    $scope.toggleAll = function () {
        _.each($scope.filters, function (value, key, list) {
            $scope.filters[key].value = true;
        });
        $scope.checkNotes();
    };

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

    function mashNotesWithRecord(notesAry, record) {
        console.log("mashNotesWithRecord ", notesAry, record);
        //generating list of unique sections present in notes
        var notes_sections = [];
        notes_sections = _.pluck(notesAry, "section");
        notes_sections = _.uniq(notes_sections);

        console.log("sections present in notes ", notes_sections);

        var res = [];
        _.each(notes_sections, function (section) {

            var section_notes = [];
            section_notes = _.filter(notesAry, {
                section: section
            });
            var section_notes_with_entry = [];
            _.each(section_notes, function (note) {
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

                var section_mod = section;
                switch (section) {
                case "conditions":
                    section_mod = "problems";
                    break;
                case "social":
                    section_mod = "social_history";
                    break;
                case "insurance":
                    section_mod = "payers";
                    break;
                }

                var data = _.where(record[section_mod], {
                    '_id': note.entry
                })[0];

                if (!data) {
                    console.log("BAAAD!!!!!", section, record[section_mod], record);
                    data = {};
                }

                var entry_data = {
                    entryData: data,
                    type: section,
                    recordEntry: {
                        metadata: {}
                    }
                };

                var titles;
                notes.getTitles(entry_data, function (err, res) {
                    if (err) {
                        console.log("Error:", err);
                    } else {
                        titles = res;
                    }
                });
                result.entryTitle = titles.entryTitle;
                result.entrySubTitleOne = titles.entrySubTitleOne;
                result.entrySubTitleTwo = titles.entrySubTitleTwo;
                section_notes_with_entry.push(result);
            });
            var result = {
                'displaySection': displaySection(section),
                'section': section,
                'notes': section_notes_with_entry
            };
            res.push(result);
        });
        return res;
    }

    $scope.clickStar = function (starVal, starIndex, section, entry) {
        console.log("click Star ", !starVal, starIndex, section, entry);
        notes.starNote(entry.note.note_id, !starVal, function (err, data) {
            console.log('err ', err);
            console.log('updated note ', data);
        });
        var tmpSection = _.where($scope.notes, {
            'section': section
        });

        _.each(tmpSection[0].notes, function (note) {
            if (entry.note.note_id === note.note.note_id) {
                note.note.starred = !starVal;
            }

        });
    };

    $scope.checkNotes = function () {
        $scope.starredNotes = false;
        $scope.unstarredNotes = false;
        _.each($scope.filters, function (filter, index) {
            if (index > 1) {
                if (filter.value) {
                    var section = filter.name;

                    var tmpnotes = _.findWhere($scope.notes, {
                        'section': section
                    });

                    _.each(tmpnotes.notes, function (note) {
                        if (note.note.starred) {
                            $scope.starredNotes = true;
                        } else {
                            $scope.unstarredNotes = true;
                        }
                    });

                }
            }
        });
    };

    $scope.noMatch = function () {
        $scope.checkNotes();
        if (!$scope.unstarredNotes && !$scope.filters[0].value) {
            return true;
        }
        if (!$scope.starredNotes && !$scope.filters[1].value) {
            return true;
        }
        if (!$scope.filters[0].value && !$scope.filters[1].value) {
            return true;
        }
        if (!$scope.any_sections_selected) {
            return true;
        }
    };
});
