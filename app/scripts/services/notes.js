'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.notes
 * @description
 * # notes
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('notes', function notes(allergies, encounters, immunizations, medications, conditions, procedures, vitals, results, social, claims, insurance, format) {

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
                    'displaySection': 'allergies',
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
                    'displaySection': 'encounters',
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
                    'displaySection': 'immunizations',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getMedications(callback) {
            medications.getRecord(function (err, entries) {

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

                            if (entry.data.administration.route.name) {
                                commentObject.entrySubTitleOne = entry.data.administration.route.name;
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
                    'section': 'medications',
                    'displaySection': 'medications',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getConditions(callback) {
            conditions.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.problem.code.name) {
                                commentObject.entryTitle = entry.data.problem.code.name;
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
                    'section': 'conditions',
                    'displaySection': 'conditions',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getProcedures(callback) {
            procedures.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.procedure.name) {
                                commentObject.entryTitle = entry.data.procedure.name;
                            }

                            if (entry.data.status) {
                                commentObject.entrySubTitleOne = entry.data.status;
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
                    'section': 'procedures',
                    'displaySection': 'procedures',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getVitals(callback) {
            vitals.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data) {
                                commentObject.entryTitle = format.formatQuantity(entry.data).displayQuantity;
                            }

                            if (entry.data.vital.name) {
                                commentObject.entrySubTitleOne = entry.data.vital.name;
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
                    'section': 'vitals',
                    'displaySection': 'vital signs',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getResults(callback) {
            results.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.result_set.name) {
                                commentObject.entryTitle = entry.data.result_set.name;
                            }

                            var dateArray = [];
                            entry.data.date_time = {};

                            _.each(entry.data.results, function (result) {

                                _.each(result.date_time, function (dateEntry, dateIndex) {
                                    if (dateIndex !== 'displayDate') {
                                        if (!dateEntry.displayDate) {

                                            format.formatDate(dateEntry);

                                        }
                                        dateArray.push(moment(dateEntry.date));
                                    }
                                });

                                if (!result.date_time.displayDate) {
                                    result.date_time.displayDate = format.outputDate(result.date_time);
                                }

                            });

                            //Construct low-high based on range.

                            var momentMin = moment.min(dateArray);
                            var momentMax = moment.max(dateArray);

                            if (momentMin.isSame(momentMax, 'day')) {
                                entry.data.date_time.point = {};
                                entry.data.date_time.point.date = momentMin.toISOString();
                                entry.data.date_time.point.precision = 'day';
                            }

                            _.each(entry.data.date_time, function (dateTime) {
                                dateTime.displayDate = format.formatDate(dateTime);
                            });

                            commentObject.entrySubTitleOne = format.outputDate(entry.data.date_time);

                            returnEntries.push(commentObject);

                        });
                    }

                });

                var returnObject = {
                    'section': 'results',
                    'displaySection': 'test results',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getSocial(callback) {
            social.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data.value) {
                                commentObject.entryTitle = entry.data.value;
                            }

                            if (entry.data.code.name) {
                                commentObject.entrySubTitleOne = entry.data.code.name;
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
                    'section': 'social',
                    'displaySection': 'social history',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getClaims(callback) {
            claims.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data) {
                                commentObject.entryTitle = entry.data.payer[0];
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
                    'section': 'claims',
                    'displaySection': 'claims',
                    'notes': returnEntries
                };

                callback(null, returnObject);
            });

        }

        function getInsurance(callback) {
            insurance.getRecord(function (err, entries) {

                var returnEntries = [];

                _.each(entries, function (entry) {

                    //Loop each note.
                    if (entry.metadata.comments) {
                        _.each(entry.metadata.comments, function (comment) {

                            var commentObject = {
                                'note': comment,
                            };

                            if (entry.data) {
                                commentObject.entryTitle = entry.data.name;
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
                    'section': 'insurance',
                    'displaySection': 'insurance',
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

        };

        this.getNotes = getNotes;

        var noteCount = function (callback) {
            getNotes(function (err, results) {

                var noteCount = 0;

                _.each(results, function (entry) {
                    _.each(entry.notes, function (note) {
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