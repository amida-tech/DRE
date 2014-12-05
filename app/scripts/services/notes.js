'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('notes', function notes(allergies, encounters, immunizations, medications, conditions, procedures, vitals, results, social, format) {

        var tmpNotes = [];

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
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getEncounters(callback) {
            encounters.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.encounter.name) {
                                commentObject.entryTitle = entry.data.encounter.name;
                            }

                            if (entry.data.locations[0].name) {
                                commentObject.entrySubTitleOne = entry.data.locations[0].name;
                            }

                            if (entry.data.date_time) {
                                _.each(entry.data.date_time, function (dateEntry) {
                                    format.formatDate(dateEntry);
                                });
                                entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                                commentObject.entrySubTitleTwo = entry.data.date_time.displayDate;
                            }

                            returnEntries.push(commentObject);

                        });
                    }

                });

                var returnObject = {
                    'section': 'encounters',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getImmunizations(callback) {
            immunizations.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.product.product.name) {
                                commentObject.entryTitle = entry.data.product.product.name;
                            }

                            if (entry.data.date_time) {
                                _.each(entry.data.date_time, function (dateEntry) {
                                    format.formatDate(dateEntry);
                                });
                                entry.data.date_time.displayDate = format.outputDate(entry.data.date_time);
                                commentObject.entrySubTitleOne = entry.data.date_time.displayDate;
                            }

                            returnEntries.push(commentObject);

                        });
                    }

                });

                var returnObject = {
                    'section': 'immunizations',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }





        var getNotes = function (callback) {

            tmpNotes = [];
            var iter = 0;

            function checkDone() {
              iter++;
              if (iter === 3) {
                callback(null, tmpNotes);  
              }
            }

            getAllergies(function (err, results) {
                tmpNotes = tmpNotes.concat(results);
                checkDone();
            });

            getEncounters(function (err, results) {
                tmpNotes = tmpNotes.concat(results);
                checkDone();
            });

            getImmunizations(function (err, results) {
                tmpNotes = tmpNotes.concat(results);
                checkDone();
            });

        };

        this.getNotes = getNotes;

    });