'use strict';

angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $window, $location, format, matches, merges, history, dataservice) {
    console.log("BILLING CONTROLLER LOAD ");

    var tempSection = $location.path().split('/');

    if (tempSection[tempSection.length - 1] === 'billing') {
        $scope.entryType = 'all';
    } else {
        $scope.entryType = tempSection[tempSection.length - 1];
    }

    $scope.setEntryType = function(newEntry) {
        if (newEntry === 'all') {
            $location.path('billing');
        } else {
            $location.path('billing/' + newEntry);
        }
    };

    $scope.singularName = function(section) {
        switch (section) {
            case 'social_history':
                return 'social history';
            case 'vitals':
                return 'vital sign';
            case 'allergies':
                return 'allergy';
            case 'medications':
                return 'medication';
            case 'problems':
                return 'problem';
            case 'claims':
                return 'claim';
            case 'results':
                return 'test result';
            case 'encounters':
                return 'encounter';
            case 'immunizations':
                return 'immunization';
            case 'procedures':
                return 'procedure';
            case 'claims':
                return 'claim';
            case 'insurance':
                return 'insurance';
            case 'payers':
                return 'payer';
            default:
                return section;
        }
    };

    history.getAccountHistory(function(err, history) {
        if (err) {
            console.log("err: " + err);
        } else {
            $scope.accountHistory = history;
            $scope.fileUploaded = false;
            _.each(history.recordHistory, function(historyObj) {
                if (_.includes(historyObj, 'fileUploaded')) {
                    $scope.fileUploaded = true;
                }
            });
            if ($scope.fileUploaded) {
                dataservice.getBillingMerges($scope.entryType, function(err, merges_billing) {
                    $scope.mergesList_billing = merges_billing;
                });

                dataservice.getProcessedRecord($scope.entryType, function(err, processed_record) {
                    if (err) {
                        console.log("err: " + err);
                    } else {
                        $scope.recordEntries = _.sortBy(processed_record, function(entry) {
                            if (entry.metadata.datetime[0]) {
                                return entry.metadata.datetime[0].date.substring(0, 9);
                            } else {
                                return '1979-12-12';
                            }
                        }).reverse();
                        if ($scope.entryType === "all") {
                            $scope.entryListFiltered = $scope.recordEntries;
                        } else {
                            console.log("UNFILTERED ", $scope.recordEntries);
                            $scope.entryListFiltered = _.where($scope.recordEntries, {
                                category: $scope.entryType
                            });
                            console.log("category ", $scope.entryType);
                            console.log("FILTERED ", $scope.entryListFiltered);
                        }
                    }
                });
            }
        }
    });

    $scope.goToMatches = function(section) {
        //console.log(section);
        //matches.setSection(section);
        $location.path('/matches');
    };
    //launch specific match (by ID and section name)
    $scope.launchMatch = function(el) {
        console.log("Launch MATCH>> ", el);
        //setting section name for matches page
        matches.setSection(el.match.section);
        //TODO: set match ID for match page
        matches.setMatchId(el.match.match_id);

        $location.path('/matches');
    };
});
