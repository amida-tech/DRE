'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('billing', function record($http, $q, format, notes) {
    this.masterRecord = {};
    this.processedRecord = {};

    this.all_notes = {};

    this.setMasterRecord = function(rawRecord) {
        this.masterRecord = rawRecord;
    };

    this.setNotes = function(rawNotes) {
        this.all_notes = rawNotes;
    };

    this.getClaims = function(callback) {
        console.log('get claims data from API');

        $http.get('/api/v1/record/claims')
            .success(function(data) {
                notes.getNotes(function(err, notes_data) {
                    if (err) {
                        console.log("notes fetching error", err);
                        callback(err);
                    } else {
                        callback(null, data.claims);
                    }

                });

            }).error(function(err) {
                callback(err);
            });
    };

    this.getInsurance = function(callback) {
        console.log('get payers data from API');

        $http.get('/api/v1/record/payers')
            .success(function(data) {
                notes.getNotes(function(err, notes_data) {
                    if (err) {
                        console.log("notes fetching error", err);
                        callback(err);
                    } else {
                        callback(null, data.payers);
                    }

                });

            }).error(function(err) {
                callback(err);
            });
    };



    this.getData = function(callback) {
        console.log('get billing data from API');

        var sources = 3;
        var data = {};

        function done(type, result) {
            sources = sources - 1;
            data[type] = result;
            if (sources === 0) {
                console.log("returning billing data", data);


                var data2 = []
                _.each(data.claims, function(entry) {
                    data2.push({
                        'data': entry,
                        'category': 'claims'
                    });

                });
                _.each(data.payers, function(entry) {
                    data2.push({
                        'data': entry,
                        'category': 'insurance'
                    });

                });


                data.records = data2;
                //delete data.claims;
                //delete data.payers;
                console.log("DATA >>>>>>>", data);

                callback(null, data);
            }
        }


        notes.getNotes(function(err, data) {
            console.log("done - notes");
            done("notes", data);
        });

        this.getInsurance(function(err, data) {
            console.log("done - insurance");
            done("payers", data);
        });
        this.getClaims(function(err, data) {
            console.log("done - claims");
            done("claims", data);
        });

    };

    this.processRecord = function(rawRecord, rawNotes, caller) {
        console.log('processing billing record', rawRecord, rawNotes, caller);
        var tmpEntries = [];
        _.each(rawRecord, function(entries, type) {
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

                var note = _.where(rawNotes, {
                    entry: entry._id
                });

                var comments = [];
                _.each(note, function(n) {
                    var comment = {
                        date: n.date,
                        starred: n.star,
                        comment: n.note,
                        entry_id: n.entry,
                        note_id: n._id
                    };

                    comments.push(comment);

                });


                if (_.contains(['claims', 'insurance', 'payers'], type)) {
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

            });
        });
        this.processedRecord = tmpEntries;
        return tmpEntries;
    };
});
