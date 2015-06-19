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
    $scope.predicate = 'note.date';
    $scope.sortString = '<i class="fa fa-sort-asc"></i>';

    $scope.notesList = [];
    $scope.masterNotesList = [];

    $scope.starFilters = [true, false];
    $scope.sectionFilters = [];
    $scope.sectionList = [];
    $scope.sectionMasterList = [];

    function updateFilters() {
        function sectionLoop(possibleNotes) {
            var filteredNotes = [];
            _.each(possibleNotes, function (note) {
                if ($scope.sectionFilters.indexOf(note.section) > -1) {
                    filteredNotes.push(note);
                }
            });
            $scope.notesList = filteredNotes;
        }
        if ($scope.starFilters.length === 2) {
            sectionLoop(_.clone($scope.masterNotesList));
            $scope.sectionList = _.clone($scope.sectionMasterList);
        } else {
            if ($scope.starFilters.length === 0) {
                $scope.notesList = [];
                $scope.sectionList = [];
            } else {
                var possibleNotes = [];
                var filteredSections = [];
                _.each(_.clone($scope.masterNotesList), function (note) {
                    if (note.starred === $scope.starFilters[0]) {
                        possibleNotes.push(note);
                        filteredSections.push(note.section);
                    }
                });
                $scope.sectionList = _.uniq(filteredSections);
                sectionLoop(possibleNotes);
            }
        }
    }

    $scope.setEntry = function (section, entryId) {
        if (section === 'insurance' || section === 'claims') {
            $location.path('/billing/' + section);
        } else {
            $location.path('/record/' + section);
        }
    };

    $scope.dateSort = function () {
        if ($scope.predicate === 'note.date') {
            //$scope.reverse = !$scope.reverse;
            $scope.predicate = '-note.date';
            $scope.sortString = '<i class="fa fa-sort-desc"></i>';
        } else {
            $scope.predicate = 'note.date';
            $scope.sortString = '<i class="fa fa-sort-asc"></i>';
            //$scope.reverse = false;
        }
    };

    dataservice.retrieveMasterRecord(function (err, master) {
        if (err) {
            console.log("err: ", err);
        } else {
            $scope.masterRecord = master;
            notes.getNotes(function (err2, all_notes) {
                if (err2) {
                    console.log("err2: ", err2);
                } else {
                    //$scope.notesList = mashNotesWithRecord(notes, master);
                    parseNotes(all_notes, master, function (err3, notesList) {
                        if (err3) {
                            console.log(err3);
                        }
                        $scope.masterNotesList = _.clone(notesList);
                        $scope.notesList = _.clone(notesList);
                    });
                    initFilters(all_notes);
                }
            });
        }
    });

    function initFilters(all_notes) {
        var notes_sections_all = _.pluck(all_notes, "section");
        var notes_sections = _.uniq(notes_sections_all);
        $scope.sectionMasterList = _.clone(notes_sections);
        $scope.sectionList = _.clone(notes_sections);
        $scope.sectionFilters = _.clone(notes_sections);
        $scope.notesList = _.clone($scope.masterNotesList);
        updateFilters();
    }

    $scope.toggleFilter = function (filterType) {
        if (filterType === "star" || filterType === "unstar") {
            if (filterType === "star") {
                if ($scope.starFilters.indexOf(true) > -1) {
                    $scope.starFilters.splice($scope.starFilters.indexOf(true), 1);
                } else {
                    $scope.starFilters.push(true);
                }
            } else {
                if ($scope.starFilters.indexOf(false) > -1) {
                    $scope.starFilters.splice($scope.starFilters.indexOf(false), 1);
                } else {
                    $scope.starFilters.push(false);
                }
            }
        } else {
            //section filters
            if ($scope.sectionFilters.indexOf(filterType) > -1) {
                $scope.sectionFilters.splice($scope.sectionFilters.indexOf(filterType), 1);
            } else {
                $scope.sectionFilters.push(filterType);
            }
        }
        updateFilters();
    };

    $scope.toggleAll = function () {
        $scope.starFilters = [true, false];
        $scope.sectionFilters = _.clone($scope.sectionMasterList);
        $scope.sectionList = _.clone($scope.sectionMasterList);
        updateFilters();
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
    $scope.displaySection = displaySection;

    function parseNotes(notesArr, record, callback) {
        var res = [];

        _.each(notesArr, function (note) {
            var result = {};
            result = {
                'entryTitle': note.entry,
                'entrySubTitleOne': '',
                'entrySubTitleTwo': '',
                'entry_id': note.entry,
                'starred': note.star,
                'section': note.section,
                'note': {
                    'comment': note.note,
                    'date': note.datetime,
                    'starred': note.star,
                    'note_id': note._id
                }
            };
            var section_mod = note.section;
            switch (note.section) {
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
                console.log("BAAAD!!!!!", note.section, record[section_mod], record);
                data = {};
                callback("baaaad error");
            }
            var entry_data = {
                entryData: data,
                type: note.section,
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
            res.push(result);
        });
        callback(null, res);
    }

    $scope.clickStar = function (starVal, entry) {
        notes.starNote(entry.note.note_id, !starVal, function (err, data) {
            if (err) {
                console.log('err ', err);
            } else {
                dataservice.forceRefresh();
            }
        });
        _.each($scope.masterNotesList, function (note) {
            if (entry.note.note_id === note.note.note_id) {
                note.starred = !starVal;
                note.note.starred = !starVal;
            }
        });
        updateFilters();
    };
});
