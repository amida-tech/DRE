'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('notes', function notes($http, format, dataservice) { //

        var tmpNotes = [];
        var all_notes = {};

        function forceRefresh() {
            all_notes = {};
        }

        function refreshNotes() {
            $http.get('/api/v1/notes/all')
                .success(function(data) {
                    all_notes = data;
                })
                .error(function(err) {
                    console.log("fetching notes failed", err);
                });
        }

        this.starNote = function(note_id, star, callback) {
            var comment = {
                "id": note_id,
                "star": star
            };

            console.log("POSTing star ", comment);

            $http.post('/api/v1/notes/star', comment)
                .success(function(data) {
                    console.log("note added successfuly");
                    forceRefresh();
                    dataservice.forceRefresh();
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("adding note failed");
                    callback(err);
                });
        };

        this.addNote = function(comment, callback) {
            console.log("POSTing comment ", comment);
            $http.post('/api/v1/notes/add', comment)
                .success(function(data) {
                    console.log("note added successfuly");
                    forceRefresh();
                    dataservice.forceRefresh();
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("adding note failed");
                    callback(err);
                });
        };

        this.getNotes = function(callback) {
            if (Object.keys(all_notes).length > 0) {
                callback(null, all_notes);
            } else {
                $http.get('/api/v1/notes/all')
                    .success(function(data) {
                        all_notes = data;
                        callback(null, data);
                    })
                    .error(function(err) {
                        console.log("fetching notes failed", err);
                        callback(err);
                    });
            }
        };

        this.editNote = function(note_id, edit, callback) {
            var comment = {
                "id": note_id,
                "note": edit
            };
            console.log("editing note API ", comment);

            $http.post('/api/v1/notes/edit', comment)
                .success(function(data) {
                    console.log("note edited successfully");
                    forceRefresh();
                    dataservice.forceRefresh();
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("editing note failed");
                    callback(err);
                });
        };

        this.deleteNote = function(id, callback) {
            var note_id = {
                "id": id
            };

            console.log("removing note ", note_id);

            $http.post('/api/v1/notes/delete', note_id)
                .success(function(data) {
                    console.log("note removed successfull");
                    forceRefresh();
                    dataservice.forceRefresh();
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("removing note failed");
                    callback(err);
                });
        };

        this.noteCount = function(callback) {

            this.getNotes(function(err, results) {

                var noteCount = 0;

                _.each(results, function(entry) {
                    //console.log(entry);
                    if (entry.star) {
                        noteCount++;
                    }
                });

                callback(null, noteCount);
            });
        };

        //convert internal section name to display friendly spelled out name
        this.getTitles = function(scope, callback) {
            scope.entryTitle = "";
            scope.entrySubTitleOne = "";
            scope.entrySubTitleTwo = "";

            var entry = scope.entryData;
            //console.log("TITLES: ", entry);
            var tmpDates = [];
            var dispDates = "Not Available";

            /* Get the a date point from the entry if possible.
             * Otherwise get a range. If range is incomplete,
             * try to use the low date first, then the high date.
             */
            function setTmpDates(entry) {
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

            if (!_.isUndefined(entry.date_time)) {
                setTmpDates(entry);
            }

            if (!_.isUndefined(entry.results) && entry.results.length > 0) {
                setTmpDates(entry.results[0]);
            }

            console.log(">>>>> ", entry, entry.participant);

            if (!_.isUndefined(entry.participant) && !_.isUndefined(entry.participant.date_time)) {
                setTmpDates(entry.participant);
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
                    console.log("conditions>>>>>", scope.recordEntry, scope.entryData);

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
                    console.log("social>>>>>", scope.recordEntry, scope.entryData);

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
                    console.log("insurance>>>>>", scope.recordEntry, scope.entryData);
                    if (scope.entryData.policy.insurance.performer.organization[0].name[0]) {
                        scope.entryTitle = scope.entryData.policy.insurance.performer.organization[0].name[0];
                    }
                    if (scope.entryData.date_time) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
            }
            callback(null, scope);
        };

    });
