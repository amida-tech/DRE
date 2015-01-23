'use strict';
/**
 * @ngdoc service
 * @name phrPrototypeApp.record
 * @description
 * # record
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('record', function record($http, $q, format) {
    this.masterRecord = {};
    this.processedRecord = {};
    this.recordDirty = false;
    this.setMasterRecord = function(rawRecord) {
        this.masterRecord = rawRecord;
    };
    this.getData = function() {
        console.log('from server');
        var deferred = $q.defer();
        var dataurl = '/scripts/services/record/record.json';
        return $http({
            url: dataurl,
            method: 'GET',
            cache: true
        }).then(function(response) {
            if (typeof response.data === 'object') {
                return response.data;
            } else {
                // invalid response
                console.log('didnt get data');
                return deferred.reject(response.data);
            }
        }, function(error) {
            // something went wrong
            console.log('data errorrrrrrr');
            return deferred.reject(error);
        });
    };
    
    this.processRecord = function(rawRecord) {
        console.log('processing record');
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
            });
        });
        this.processedRecord = tmpEntries;
        return tmpEntries;
    };
});