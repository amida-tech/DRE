'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('record', function record($http, $q, format, notes, dataservice) {
    this.masterRecord = {};
    this.processedRecord = {};

    this.all_notes = {};

    this.setMasterRecord = function (rawRecord) {
        this.masterRecord = rawRecord;
    };

    this.setNotes = function (rawNotes) {
        this.all_notes = rawNotes;
    };

    this.getData = function (callback) {
        dataservice.retrieveMasterRecord(function (err, data) {
            if (err) {
                notes.getNotes(function (err2, notes_data) {
                    if (err2) {
                        console.log("notes fetching error", err2);
                        callback(err2);
                    } else {
                        callback(null, {
                            "records": data,
                            "notes": notes_data
                        });
                    }
                });
            } else {
                callback(err);
            }
        });
    };

    this.processRecord = function (rawRecord, rawNotes, caller) {
        //console.log('processing record', rawRecord, rawNotes, caller);
        var tmpEntries = [];
        _.each(rawRecord, function (entries, type) {

            //console.log("process record entries, type", entries, type);

            _.each(entries, function (entry) {
                var tmpDates = '';
                var dispDates = '';

                //console.log("calculating dates for ",type, entry);

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

                if (tmpDates.length === 1) {
                    dispDates = format.formatDate(tmpDates[0]);
                } else if (tmpDates.length === 2) {
                    dispDates = format.formatDate(tmpDates[0]) + ' - ' + format.formatDate(tmpDates[1]);
                }

                var note = _.where(rawNotes, {
                    entry: entry._id
                });

                var comments = [];
                _.each(note, function (n) {
                    var comment = {
                        date: n.date,
                        starred: n.star,
                        comment: n.note,
                        entry_id: n.entry,
                        note_id: n._id
                    };

                    comments.push(comment);

                });

                //TODO: remove social, problems from list below (it breaks something)
                if (!_.contains(['demographics', 'plan_of_care'], type)) {

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

                    //inject notest into entry
                    var tmpEntry = {
                        'data': entry,
                        'category': display_type,
                        'metadata': {
                            'comments': comments,
                            'displayDate': dispDates,
                            'datetime': tmpDates
                        }
                    };

                    tmpEntries.push(tmpEntry);

                }
                /*
                if (!_.contains(['demographics', 'problems', 'plan_of_care', 'payers', 'social_history'], type)) {
                    tmpEntries.push({
                        'data': entry,
                        'category': type,
                        'metadata': {
                            'comments': '',
                            'displayDate': dispDates,
                            'datetime': tmpDates
                        }
                    });
                }
                if (type === 'social_history') {
                    tmpEntries.push({
                        'data': entry,
                        'category': 'social',
                        'metadata': {
                            'comments': '',
                            'displayDate': dispDates,
                            'datetime': tmpDates
                        }
                    });
                }
                */
            });
        });
        this.processedRecord = tmpEntries;
        return tmpEntries;
    };
});
