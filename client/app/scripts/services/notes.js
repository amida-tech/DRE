'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('notes', function notes($http, format) { //

        var tmpNotes = [];


        /*
                function getAllergies(callback) {
                    allergies.getRecord(function (err, entries) {

                        var returnEntries = [];

                        _.each(entries, function (entry) {

                            //Loop each note.
                            if (entry.metadata.comments) {
                                _.each(entry.metadata.comments, function (comment) {

                                    var commentObject = {
                                        'note': comment,
                                    };

                                    if (entry.data.observation.allergen.name) {
                                        commentObject.entryTitle = entry.data.observation.allergen.name;
                                    }

                                    if (entry.data.observation.severity.code.name) {
                                        commentObject.entrySubTitleOne = entry.data.observation.severity.code.name;
                                    }

                                    if (entry.data.observation.date_time) {
                                        _.each(entry.data.observation.date_time, function (dateEntry) {
                                            format.formatDate(dateEntry);
                                        });
                                        entry.data.observation.date_time.displayDate = format.outputDate(entry.data.observation.date_time);
                                        commentObject.entrySubTitleTwo = entry.data.observation.date_time.displayDate;
                                    }

                                    returnEntries.push(commentObject);

                                });
                            }

                        });

                        var returnObject = {
                            'section': 'allergies',
                            'displaySection': 'allergies',
                            'notes': returnEntries
                        };

                        callback(null, returnObject);
                    });

                }

        */


        this.starNote = function(note_id, star, callback) {
            var comment = {
                "id": note_id,
                "star": star
            };

            console.log("POSTing star ",comment);

            $http.post('/api/v1/notes/star', comment)
                .success(function(data) {
                    console.log("note added successfuly");
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("adding note failed");
                    callback(err);
                });
        };


        this.addNote = function(comment, callback) {
            console.log("POSTing comment ",comment);
            $http.post('/api/v1/notes/add', comment)
                .success(function(data) {
                    console.log("note added successfuly");
                    callback(null, data);
                })
                .error(function(err) {
                    console.log("adding note failed");
                    callback(err);
                });
        };

        this.getNotes = function(callback) {

            $http.get('/api/v1/notes/all')
                .success(function(data) {
                    callback(null, data);
                }).error(function(err) {
                    callback(err);
                });

            /*
                        var iter = 0;

                        function checkDone() {
                            iter++;
                            if (iter === 11) {
                                callback(null, tmpNotes);
                            }
                        }

                        getMedications(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getResults(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getEncounters(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getVitals(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getImmunizations(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getAllergies(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getConditions(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getProcedures(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getSocial(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getClaims(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

                        getInsurance(function (err, results) {
                            tmpNotes = tmpNotes.concat(results);
                            checkDone();
                        });

            */

        };

        var noteCount = function(callback) {

            this.getNotes(function(err, results) {

                var noteCount = 0;

                _.each(results, function(entry) {
                    _.each(entry.notes, function(note) {
                        if (note.note.starred) {
                            noteCount++;
                        }
                    });
                });

                callback(null, noteCount);
            });
        };

        this.noteCount = noteCount;

    });
