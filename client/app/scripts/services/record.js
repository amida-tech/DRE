'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('record', function record($http, $q, format, notes) {
    this.masterRecord = {};
    this.processedRecord = {};

    this.all_notes = {};

    this.setMasterRecord = function(rawRecord) {
        this.masterRecord = rawRecord;
    };

    this.setNotes = function(rawNotes) {
        this.all_notes = rawNotes;
    };

    this.getData = function(callback) {
        console.log('from server');

        $http.get('/api/v1/get_record/')
            .success(function(data) {
                notes.getNotes(function(err, notes_data) {
                    if (err) {
                        console.log("notes fetching error", err);
                        callback(err);
                    } else {
                        callback(null, {
                            "records": data,
                            "notes": notes_data
                        });
                    }

                });

            }).error(function(err) {
                callback(err);
            });
    };

    this.processRecord = function(rawRecord, rawNotes) {
        console.log('processing record');
        var tmpEntries = [];
        _.each(rawRecord, function(entries, type) {

            console.log("process record entries, type", entries, type);

            _.each(entries, function(entry) {
                var tmpDates = '';
                var dispDates = '';
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
                    dispDates = format.formatDate(tmpDates[0]);
                } else if (tmpDates.length === 2) {
                    dispDates = format.formatDate(tmpDates[0]) + ' - ' + format.formatDate(tmpDates[1]);
                }


                console.log("notes ", rawNotes);
                var note = _.where(rawNotes, {
                    entry: entry._id
                });
                console.log("find note", note, entry);

                var comments = [];
                _.each(note, function(n) {
                    var comment = {
                        date: n.date,
                        starred: n.star,
                        comment: n.note,
                    };

                    comments.push(comment);

                });

                //inject notest into entry
                var tmpEntry = {
                    'data': entry,
                    'category': type,
                    'metadata': {
                        'comments': comments,
                        'displayDate': dispDates,
                        'datetime': tmpDates
                    }
                };

                tmpEntries.push(tmpEntry);

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
