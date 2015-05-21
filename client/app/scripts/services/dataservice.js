'use strict';
/**
 * Data service for access to backend APIs and keeping state of app
 */

angular.module('phrPrototypeApp').service('dataservice', function dataservice($http, $q, format, notes) {
    var master_record = {};
    var master_merges = [];
    var master_entries = [];
    var all_notes = {};

    function displayTypeNew(type) {
        var display_type = type;
        if (type === 'social_history') {
            display_type = 'social';
        }
        if (type === 'payers') {
            display_type = 'insurance';
        }
        if (type === 'problems') {
            display_type = 'conditions';
        }

        return display_type;
    }

    function getAllNotes(callback) {
        notes.getNotes(function (err, notes) {
            if (err) {
                console.log("err: ", err);
                callback(err);
            } else {
                all_notes = notes;
                callback(null, notes);
            }
        });
    }

    function collateCommentsNew(entry) {
        var comments = [];

        //find all notes for current entry
        var note = _.where(all_notes, {
            entry: entry._id
        });

        //format each note, and collate into array
        _.each(note, function (n) {
            var comment = {
                date: n.datetime,
                starred: n.star,
                comment: n.note,
                entry_id: n.entry,
                note_id: n._id
            };

            comments.push(comment);

        });

        return comments;
    }

    function extractAndFormat(type, entry) {

        var tmpDates = '';
        var displayDates = '';

        //handling date_time location for lab results
        if (type === 'results' && !_.isUndefined(entry.results) && entry.results.length > 0) {
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

        //handling date_time location for payers(insurance)
        if ((type === 'payers' || type === 'insurance') && !_.isUndefined(entry.participant.date_time)) {
            if (!_.isUndefined(entry.participant.date_time.point)) {
                tmpDates = [entry.participant.date_time.point];
            } else if (!_.isUndefined(entry.participant.date_time.low) && !_.isUndefined(entry.participant.date_time.high)) {
                tmpDates = [entry.participant.date_time.low, entry.participant.date_time.high];
            } else if (!_.isUndefined(entry.participant.date_time.low) && _.isUndefined(entry.participant.date_time.high)) {
                tmpDates = [entry.participant.date_time.low];
            } else if (_.isUndefined(entry.participant.date_time.low) && !_.isUndefined(entry.participant.date_time.high)) {
                tmpDates = [entry.participant.date_time.high];
            }
        }

        //handling date_time for the rest of the sections
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

        if (tmpDates.length === 1) {
            displayDates = format.formatDate(tmpDates[0]);
        } else if (tmpDates.length === 2) {
            displayDates = format.formatDate(tmpDates[0]) + ' - ' + format.formatDate(tmpDates[1]);
        }

        return {
            "display": displayDates,
            "temp": tmpDates
        };
    }

    function retrieveMasterRecord(callback) {
        if (Object.keys(master_record).length > 0) {
            callback(null, master_record);
        } else {
            $http.get('/api/v1/get_record')
                .success(function (data) {
                    console.log("master record fetched successfuly");
                    master_record = data;
                    callback(null, data);
                })
                .error(function (err) {
                    console.log("fetching master record failed", err);
                    callback("master_record failed " + err);
                });
        }
    }

    this.retrieveMasterRecord = retrieveMasterRecord;

    function getAllMerges(callback) {
        $http.get('/api/v1/merges')
            .success(function (data) {
                console.log("merges fetched successfuly");
                master_merges = data.merges;
                callback(null, data.merges);
            })
            .error(function (err) {
                console.log("fetching merges failed", err);
                callback(err);
            });
    }

    function parseEntries(callback) {
        master_entries = [];
        _.each(master_record, function (entries, type) {
            _.each(entries, function (entry) {
                //gate (ignore) possible sections that are not applicable here
                if (_.contains(['demographics', 'plan_of_care'], type)) {
                    //skip to next entry (next iteration)
                    return;
                }

                //calculate displayDates for entry based on type
                var dates = extractAndFormat(type, entry);

                if (dates.temp === "") {
                    dates.temp = [{
                        "date": "2015-02-11T00:00:00.000Z",
                        "precision": "day",
                        "displayDate": "Feb 12, 2015"
                    }];
                }

                //collate all notes into array (with formatting) for current entry
                var comments = collateCommentsNew(entry);

                var display_type = displayTypeNew(type);

                var tmpEntry = {
                    'data': entry,
                    'category': display_type,
                    'metadata': {
                        'comments': comments,
                        'displayDate': dates.display,
                        'datetime': dates.temp
                    }
                };

                //add cleaned up and formatted entry to processed entries array
                master_entries.push(tmpEntry);
            });
        });
        callback(null, master_entries);
    }

    this.getProcessedRecord = function (callback) {
        console.log("get processed record");
        if (master_entries.length > 0) {
            callback(null, master_entries);
        } else {
            getAllNotes(function (err, notes) {
                console.log("get all notes");
                if (err) {
                    console.log("err: " + err);
                    callback(err);
                } else {
                    retrieveMasterRecord(function (err3, record) {
                        console.log("get all records");
                        if (err3) {
                            console.log("err3: " + err3);
                            callback(err3);
                        } else {
                            parseEntries(function (err4, entries) {
                                console.log("parsed");
                                if (err4) {
                                    console.log('err4: ' + err4);
                                    callback(err4);
                                } else {
                                    console.log("entries", entries);
                                    callback(null, entries);
                                }
                            });
                        }
                    });
                }
            });
        }
    };

    this.getMergesListRecord = function (callback) {
        if (master_merges.length > 0) {
            callback(null, master_merges);
        } else {
            getAllMerges(function (err2, merges) {
                if (err2) {
                    console.log("err: " + err2);
                    callback(err2);
                } else {
                    callback(null, merges);
                }
            });
        }
    };

    this.getMatchSection = function (section, callback) {
        if (!section || section === "all") {
            console.log('no need to fetch matches for all');
            callback("no section or not needed for all");
        } else {
            //translating section name to backend API terms
            var section_backend = section;
            switch (section) {
            case "conditions":
                section_backend = "problems";
                break;
            case "social":
                section_backend = "social_history";
                break;
            }

            console.log('getting matches from API for section ' + section_backend);
            $http.get('/api/v1/matches/' + section_backend)
                .success(function (data) {
                    console.log("matches fetched successfuly");
                    callback(null, data.matches);
                })
                .error(function (err) {
                    console.log("fetching matches failed", err);
                    callback(err);
                });
        }
    };

    function filterMerges(merges, callback) {
        var filtered_record = [];
        var filtered_billing = [];
        _.each(merges, function (merge) {
            if (!_.contains(['claims', 'payers'], merge.entry_type)) {
                filtered_record.push(merge);
            } else {
                filtered_billing.push(merge);
            }
        });
        callback(null, filtered_billing, filtered_record);
    }

    this.getBillingMerges = function (section, callback) {
        this.getMergesListRecord(function (err, merges) {
            if (err) {
                console.log("err: " + err);
                callback(err);
            } else {
                filterMerges(merges, function (err, billing, record) {
                    if (err) {
                        console.log("err: " + err);
                        callback(err);
                    } else {
                        console.log("billing: ", billing);
                        callback(null, billing);
                    }
                });
            }
        });
    };

    this.forceRefresh = function () {
        master_record = {};
        master_merges = [];
        master_entries = [];
        all_notes = {};
    };
});
