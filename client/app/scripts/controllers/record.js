'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('RecordCtrl', function($scope, $window, record, format, matches, merges, history) {
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

    getHistory();



    merges.getMerges(function(err, data) {
        if (err) {
            console.log("error whil getting merges ", err);
        } else {
            $scope.mergesList = data;

            console.log("merges data ", $scope.mergesList);
        }

    });

    // produces singular name for section name - in records merges list
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
            case 'insurances':
                return 'insurance';
            case 'procedures':
                return 'procedure';
            default:
                return section;
        }
    };

    function pageRender(data, data_notes) {
        $scope.dashMetrics = {};
        $scope.tabs = [{
            "title": "Weight",
            "data": {},
            "chartName": "d3template"
        }, {
            "title": "Blood Pressure",
            "data": {},
            "chartName": "d3template"
        }];
        $scope.tabs.activeTab = 0;
        $scope.$watch('tabs.activeTab', function(newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.$broadcast('tabchange', {
                    "val": newVal
                });
            }
        });

        $scope.pageLoaded = false;
        $scope.entryType = "all";
        //Flip All as active selected item in DOM
        angular.element("#navall").addClass("active");

        if (_.isEmpty(record.processedRecord)) {
            $scope.recordEntries = record.processRecord(data, data_notes, "record.js controller");
        } else {
            $scope.recordEntries = record.processedRecord;
        }
        $scope.recordEntries = _.sortBy($scope.recordEntries, function(entry) {
            if (entry.metadata.datetime[0]) {
                return entry.metadata.datetime[0].date.substring(0, 9);
            } else {
                return '1979-12-12';
            }
        }).reverse();
        $scope.entryListFiltered = $scope.recordEntries;
        $scope.$watch('entryType', function(newVal, oldVal) {
            //keeping current section name in scope
            $scope.entryType = newVal;
            console.log("$scope.entryType = ", $scope.entryType);
            getData();


            if (newVal !== oldVal) {
                if (newVal === "all") {
                    $scope.entryListFiltered = $scope.recordEntries;
                } else {
                    $scope.entryListFiltered = _.where($scope.recordEntries, {
                        category: newVal
                    });
                }
                if (newVal === "vitals") {
                    $scope.$broadcast('tabchange', {
                        "val": 0
                    });
                }
            }
        });



    }
    if (_.isEmpty(record.masterRecord) || record.recordDirty) {
        record.getData(function(err, data) {
            //getNotes and associate them with record

            record.setNotes(data.notes);
            record.setMasterRecord(data.records);

            pageRender(data.records, data.notes);
        });
    } else {
        pageRender(record.masterRecord, record.all_notes);
    }


    $scope.masterMatches = {};

    // Get Matches data for partial matches 
    function getData() {
        console.log("getting merges for section ", $scope.entryType);
        if (!$scope.entryType || $scope.entryType === 'all') {
            return;
        }

        matches.getCategory($scope.entryType).then(function(data) {
            $scope.masterMatches = {
                'category': $scope.entryType,
                'data': data.matches,
                'count': data.matches.length
            };
            //do stuff here
            $scope.allergyMatch = $scope.masterMatches.data[1];
        });
    }
    getData();
});
