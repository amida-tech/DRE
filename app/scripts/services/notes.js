'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('notes', function notes(allergies, format) {

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

        var getNotes = function (callback) {

            tmpNotes = [];

            getAllergies(function (err, results) {
                tmpNotes = tmpNotes.concat(results);
                callback(null, tmpNotes);
            });

        };

        this.getNotes = getNotes;

    });