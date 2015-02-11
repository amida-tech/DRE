'use strict';
/**
 * Data service for access to backend APIs and keeping state of app
 */

angular.module('phrPrototypeApp').service('dataservice', function dataservice($http, $q, format, notes) {
    var that = this;

    //master record (full copy of /api/get_record)
    this.master_record = {};

    //list of all notes (full copy of /api/notes)
    this.all_notes = {};

    //all merges (full copy of /api/merges)
    this.all_merges = [];
    this.merges_record = [];
    this.merges_billing = [];

    //currently active section (for matches and navigation) -record page
    this.curr_section = "";

    //currently active section (for navigation) -billing page
    this.curr_section_billing = "";

    //current matches
    this.curr_matches = [];

    //current match id
    this.curr_match_id = "";

    //current processed matches
    // {category, data, count}
    this.curr_processed_matches = {};

    //record with 
    //  injected notes
    //  matches (for currently selected section)
    //  counted pending updates (matches)
    this.processed_record = [];


    //fetch all the data form APIs
    //including:
    //  master_record
    //  notes
    //  merges
    //  currently selected matches
    //
    //  saves data into local this.* vars (see above)
    this.fetchData = function(callback) {

        //4 data sources, counted in done() for syncronization
        var sources = 4;
        var count = 0;

        var that = this;

        function done(type, err, data) {
            count = count + 1;

            switch (type) {
                case "master_record":
                    that.master_record = data;
                    break;
                case "notes":
                    that.all_notes = data;
                    break;
                case "merges":
                    that.all_merges = data;
                    break;
                case "matches":
                    that.curr_matches = data;
                    break;
            }

            //callback when all sources are returned
            if (count === sources) {
                callback();
            }
        }

        this.getMasterRecord(done);
        this.getNotes(done);
        this.getMerges(done);
        this.getMatches(this.curr_section, done);

    };




    this.getMasterRecord = function(callback) {
        console.log('getting master record from API');
        $http.get('/api/v1/get_record')
            .success(function(data) {
                console.log("master record fetched successfuly");
                callback("master_record", null, data);
            })
            .error(function(err) {
                console.log("fetching master record failed", err);
                callback("master_record", err);
            });
    };


    this.getNotes = function(callback) {
        console.log('getting notes from API');
        $http.get('/api/v1/notes/all')
            .success(function(data) {
                console.log("notes fetched successfuly");
                callback("notes", null, data);
            })
            .error(function(err) {
                console.log("fetching notes failed", err);
                callback("notes", err);
            });
    };

    this.getMerges = function(callback) {
        console.log('getting merges from API');
        $http.get('/api/v1/merges')
            .success(function(data) {
                console.log("merges fetched successfuly");
                callback("merges", null, data.merges);
            })
            .error(function(err) {
                console.log("fetching merges failed", err);
                callback("merges", err);
            });
    };


    /* TODO: merge history here

    this.getHistory = function(callback) {
        console.log('getting history from API');
        $http.get('/api/v1/notes/all')
            .success(function(data) {
                console.log("notes fetched successfuly");
                callback("notes", null, data);
            })
            .error(function(err) {
                console.log("fetching notes failed", err);
                callback("notes", err);
            });
    };
        function getHistory() {
            history.getHistory(function(err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {
                    //console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        } 

    */

    this.getMatches = function(section, callback) {
        //no need to fetch anything if section is all
        if (!section || section === "all") {
            console.log('no need to fetch matches for all');
            callback("matches", null, []);
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
                .success(function(data) {
                    console.log("matches fetched successfuly");
                    callback("matches", null, data.matches);
                })
                .error(function(err) {
                    console.log("fetching matches failed", err);
                    callback("matches", err);
                });
        }
    };

    //processes data
    //  calculates displayDates for all entries
    //  injects notes information in releated entries

    this.processData = function() {
        this.processed_record = []; //next step will fully rebuild processed record

        _.each(this.master_record, function(entries, type) {
            _.each(entries, function(entry) {
                //gate (ignore) possible sections that are not applicable here              
                if (_.contains(['demographics', 'plan_of_care'], type)) {
                    //skip to next entry (next iteration)
                    return;
                }

                //calculate displayDates for entry based on type
                var dates = that.extractAndFormatDate(type, entry);

                if (dates.temp === "") {
                    dates.temp = [{
                        "date": "2015-02-11T00:00:00.000Z",
                        "precision": "day",
                        "displayDate": "Feb 12, 2015"
                    }];
                }

                //collate all notes into array (with formatting) for current entry
                var comments = that.collateComments(entry);


                var display_type = that.displayType(type);

                //formats processed entry for processed record
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
                that.processed_record.push(tmpEntry);
            });
        });
    };

    //rename internal DRE section names into UI human readable names
    this.displayType = function(type) {
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
    };

    //collate all notes in formatted array for provided entry
    //notes data is coming from local service var (all_notes)
    this.collateComments = function(entry) {
        var comments = [];

        //find all notes for current entry
        var note = _.where(this.all_notes, {
            entry: entry._id
        });

        //format each note, and collate into array
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

        return comments;
    };

    //takes type of entry (section) and entry data, and returns formatted date (or time interval)
    this.extractAndFormatDate = function(type, entry) {

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
    };


    //split merges for display in records view and billing view
    this.processMerges = function() {
        var filtered_record = [];
        var filtered_billing = [];

        _.each(this.all_merges, function(merge) {
            //console.log(merge);

            // no claims and payers merges here
            if (!_.contains(['claims', 'payers'], merge.entry_type)) {
                filtered_record.push(merge);
            } else {
                filtered_billing.push(merge);
            }
        });

        this.merges_record = filtered_record;
        this.merges_billing = filtered_billing;
    };


    //process matches for current section
    //calculate counts
    this.processMatches = function() {
        if (!this.curr_section || this.curr_section === 'all') {
            return;
        } else {
            this.curr_processed_matches = {
                'category': this.curr_section,
                'data': this.curr_matches,
                'count': this.curr_matches.length
            };

            //Wire matches into the record
            _.each(that.curr_processed_matches.data, function(match) {
                var match_count = 0;

                //console.log(mat)
                //console.log("match id and master entry id", match._id, match.entry._id, $scope.recordEntries);
                //find $scope.recordEntries.data._id === match.entry._id

                _.each(that.processed_record, function(recordEntry) {
                    //console.log(">>>>> recordEntry ",recordEntry);
                    //console.log(">>>>> curr_matches",that.curr_matches);

                    if (recordEntry.data._id === match.matches[0].match_entry._id) {
                        //console.log("attaching match ", recordEntry, match);

                        //calculate number of pending matches per entry

                        //if (recordEntry.metadata.match && recordEntry.metadata.match.count) {
                        match_count = match_count + 1;
                        //} else {
                        //match_count = 1;
                        //}
                        recordEntry.metadata.match = {
                            'match_id': match._id,
                            'section': that.curr_section,
                            'count': match_count
                        };

                    }
                    if (match_count===0 && recordEntry.metadata.match){
                        delete recordEntry.metadata.match;
                    }
                });


            });
        }

    };

    //THIS IS THE FUNCTION YOU ARE LOOKING FOR!
    //
    //processes fetched data
    //including:
    //  master_record
    //      processes record
    //  notes
    //      calculates count of starred notes per element
    //  merges
    //      does nothing...???
    //  currently selected matches
    //      calculates counts of matches per element
    this.getData = function(callback) {
        console.log("in get data");

        this.fetchData(function() {
            //once all the data is fetched
            //process it

            that.processed_record = []; //next step will fully rebuild processed record
            that.processData();

            //split merges between records view and billing view
            that.processMerges();

            //wrap match object and calculate all the counts (of pending updates per record)
            that.processMatches();

            //at this point this.processed_record is ready to use

            console.log("before callback");
            callback();

        });
    };

    this.getMatchesData = function(callback) {
        console.log("in get matches data");

        this.getMatches(this.curr_section, function(type, err, data) {
            //once all the data is fetched

            that.curr_matches = data;

            //process it

            //wrap match object and calculate all the counts (of pending updates per record)
            that.processMatches();

            //at this point this.processed_record is ready to use

            console.log("before callback from getMatchesData");
            callback();

        });
    };

});
