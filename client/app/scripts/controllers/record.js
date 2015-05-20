'use strict';

function singularName(section) {
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
}

angular.module('phrPrototypeApp')
    .controller('RecordCtrl', function ($scope, $location, $route, matches, merges, history, dataservice) {

        $scope.entryType = 'all';

        $scope.setEntryType = function (newEntry) {
            if (newEntry !== 'all') {
                $location.path('record/' + newEntry);
            }
        };

        $scope.singularName = singularName;
        $scope.dashMetrics = {};
        $scope.tabs = [{
            "title": "Weight",
            "type": "weight",
            "lower": "Weight (lbs)",
            "data": {},
            "chartName": "d3template"
        }, {
            "title": "Blood Pressure",
            "type": "bloodPressure",
            "lower": "Blood Pressure",
            "data": {},
            "chartName": "d3template"
        }];
        $scope.tabs.activeTab = 0;
        $scope.onTabSelect = function (tab) {
            $scope.$broadcast('tabchange', {
                "val": $scope.tabs.indexOf(tab)
            });
        };

        dataservice.getMergesListRecord(function (err, merges_record) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.mergesList_record = merges_record;
            }

        });

        history.getAccountHistory(function (err, history) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.accountHistory = history;
            }
        });

        //calculate current height/weight/bmi/blood pressure
        //based on processed record from $scope.recordEntries
        function dashPrep() {
            var weightDateArray = [];
            var heightDateArray = [];
            var bpDateArraySystolic = [];
            var bpDateArrayDiastolic = [];
            //Build arrays of all dates per section.
            _.each($scope.recordEntries, function (entry) {
                var vitalEntry = {};
                //skip non vitals entries
                if (entry.category !== "vitals") {
                    return;
                } else {
                    vitalEntry = entry;
                }
                console.log("vital entry ", vitalEntry);

                if (vitalEntry.data.vital.name === "Height") {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        heightDateArray.push(moment(dateArr.date));
                    });
                }
                if (vitalEntry.data.vital.name === "Patient Body Weight - Measured") {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        weightDateArray.push(moment(dateArr.date));
                    });
                }
                if (vitalEntry.data.vital.name === "Intravascular Systolic") {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        bpDateArraySystolic.push(moment(dateArr.date));
                    });
                }
                if (vitalEntry.data.vital.name === "Intravascular Diastolic") {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        bpDateArrayDiastolic.push(moment(dateArr.date));
                    });
                }
            });
            //Flag maxes.
            var heightMaxDate = moment.max(heightDateArray);
            var weightMaxDate = moment.max(weightDateArray);
            var bpMaxDateDiastolic = moment.max(bpDateArrayDiastolic);
            var bpMaxDateSystolic = moment.max(bpDateArraySystolic);
            //Recover associated max value.
            _.each($scope.entries.vitals, function (vitalEntry2) {
                var vitalEntry = {
                    "data": vitalEntry2
                };

                //Find most current height.
                if (vitalEntry.data.vital.name.indexOf("Height") > -1) {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        if (moment(moment(dateArr.date)).isSame(heightMaxDate, 'day')) {
                            $scope.dashMetrics.height = {
                                value: vitalEntry.data.value,
                                unit: vitalEntry.data.unit
                            };
                        }
                    });
                }
                if (vitalEntry.data.vital.name.indexOf("Weight") > -1) {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        if (moment(moment(dateArr.date)).isSame(weightMaxDate, 'day')) {
                            $scope.dashMetrics.weight = {
                                value: vitalEntry.data.value,
                                unit: vitalEntry.data.unit
                            };
                        }
                    });
                }
                if (vitalEntry.data.vital.name.indexOf("Systolic") > -1) {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        if (moment(moment(dateArr.date)).isSame(bpMaxDateSystolic, 'day')) {
                            $scope.dashMetrics.systolic = {
                                value: vitalEntry.data.value,
                                unit: vitalEntry.data.unit
                            };
                        }
                    });
                }
                if (vitalEntry.data.vital.name.indexOf("Diastolic") > -1) {
                    _.each(vitalEntry.data.date_time, function (dateArr) {
                        if (moment(moment(dateArr.date)).isSame(bpMaxDateDiastolic, 'day')) {
                            $scope.dashMetrics.diastolic = {
                                value: vitalEntry.data.value,
                                unit: vitalEntry.data.unit
                            };
                        }
                    });
                }
            });

            console.log("dash metrics >>>>", $scope.dashMetrics);

            //convert height to inches if needed
            if ($scope.dashMetrics.height.unit === "cm") {
                $scope.dashMetrics.height.unit = "[in_us]";
                $scope.dashMetrics.height.value = 0.393701 * $scope.dashMetrics.height.value;
                $scope.dashMetrics.height.value = Math.round($scope.dashMetrics.height.value);
            }

            //Format height output.
            if ($scope.dashMetrics.height.unit === "[in_us]") {
                var displayHeight = Math.floor(($scope.dashMetrics.height.value / 12)) + "' " + Math.floor($scope.dashMetrics.height.value % 12) + '"';
                $scope.dashMetrics.height.disp = displayHeight;
            }

            //convert weight to lbs
            if ($scope.dashMetrics.weight.unit === "kg") {
                $scope.dashMetrics.weight.unit = "[lb_av]";
                $scope.dashMetrics.weight.value = 2.20462 * $scope.dashMetrics.weight.value;
            }
            //Format weight output.
            if ($scope.dashMetrics.weight.unit === "[lb_av]") {
                var displayWeight = Math.floor($scope.dashMetrics.weight.value) + " lbs";
                $scope.dashMetrics.weight.disp = displayWeight;
            }
            //BMI Calculation
            //Expects US units.
            function calculateBMI(weight, height) {
                var BMI = (weight * 703) / (height * height);
                BMI = BMI.toFixed(1);
                return BMI;
            }
            $scope.dashMetrics.bmi = calculateBMI($scope.dashMetrics.weight.value, $scope.dashMetrics.height.value);
        }

        function filterEntries(val) {
            $scope.entryListFiltered = _.where($scope.recordEntries, {
                category: val
            });
        }

        dataservice.getProcessedRecord(function (err, processed_record) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.recordEntries = _.sortBy(processed_record, function (entry) {
                    if (entry.metadata.datetime[0]) {
                        return entry.metadata.datetime[0].date.substring(0, 9);
                    } else {
                        return '1979-12-12';
                    }
                }).reverse();
                dataservice.retrieveMasterRecord(function (err2, master_record) {
                    if (err2) {
                        console.log("err2: " + err2);
                    } else {
                        $scope.entries = master_record;
                        dashPrep();
                    }
                });
            }
        });

        $scope.goToMatches = function (section) {
            $location.path('/matches');
        };

        //launch specific match (by ID and section name)
        $scope.launchMatch = function (el) {
            matches.setSection(el.match.section);
            matches.setMatchId(el.match.match_id);

            $location.path('/matches');
        };

    })
    .controller('SectionMedicationCtrl', function ($scope, $location, $modal, $route, matches, merges, history, dataservice) {

        $scope.entryType = 'medications';

        $scope.setEntryType = function (newEntry) {
            if (newEntry === 'all') {
                $location.path('record');
            } else {
                $location.path('record/' + newEntry);
            }
        };

        $scope.singularName = singularName;

        $scope.medicationDetails = function (medication) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'views/modals/medications.html',
                controller: 'MedicationDetailModalCtrl',
                resolve: {
                    medication: function () {
                        return medication;
                    }
                }
            });
            modalInstance.result.then(function (response) {
                console.log(response);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.entryModal = function () {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'views/modals/medicationentry.html',
                controller: 'MedicationEntryModalCtrl'
            });
            modalInstance.result.then(function (response) {
                console.log(response);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.updateModal = function (medication) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'views/modals/medicationupdate.html',
                controller: 'MedicationUpdateModalCtrl',
                resolve: {
                    medication: function () {
                        return medication;
                    }
                }
            });
            modalInstance.result.then(function (response) {
                console.log(response);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deleteModal = function (medication) {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'views/modals/medicationdelete.html',
                controller: 'MedicationDeleteModalCtrl',
                resolve: {
                    medication: function () {
                        return medication;
                    }
                }
            });
            modalInstance.result.then(function (response) {
                console.log(response);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        // Meds active/inactive selector
        $scope.activeSelection = ['active', 'inactive'];
        $scope.toggleSelection = function toggleSelection(buttonName) {
            var idx = $scope.activeSelection.indexOf(buttonName);

            if (idx > -1) {
                $scope.activeSelection.splice(idx, 1);
            } else {
                $scope.activeSelection.push(buttonName);
            }
        };

        dataservice.getMatchSection($scope.entryType, function (err, matches) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.masterMatches = matches;
            }
        });

        history.getAccountHistory(function (err, history) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.accountHistory = history;
            }
        });

        function filterEntries(val) {
            console.log("UNFILTERED ", $scope.recordEntries);

            $scope.entryListFiltered = _.where($scope.recordEntries, {
                category: val
            });

            console.log("filtered ", $scope.entryListFiltered);
            console.log("val", val);
            // Filter on active/inactive
            if ($scope.activeSelection.indexOf('active') > -1 && $scope.activeSelection.indexOf('inactive') > -1) { // All entries

            } else if ($scope.activeSelection.indexOf('active') > -1) { // Active only

                $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                    var curDate = new Date();
                    var entryDate = new Date();
                    if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                        entryDate = new Date(entry.data.date_time.high.date);
                    }
                    return (entry.category === val) && (entryDate >= curDate);
                });
            } else if ($scope.activeSelection.indexOf('inactive') > -1) { // Inactive only
                $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                    var curDate = new Date();
                    var entryDate = new Date();
                    if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                        entryDate = new Date(entry.data.date_time.high.date);
                    }
                    return (entry.category === val) && (entryDate < curDate);
                });
            } else { // None
                $scope.entryListFiltered = [];
            }
        }

        dataservice.getProcessedRecord(function (err, processed_record) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.recordEntries = _.sortBy(processed_record, function (entry) {
                    if (entry.metadata.datetime[0]) {
                        return entry.metadata.datetime[0].date.substring(0, 9);
                    } else {
                        return '1979-12-12';
                    }
                }).reverse();
                filterEntries($scope.entryType);
            }
        });

        $scope.$watch('activeSelection', function (newVal, oldVal) {
            filterEntries($scope.entryType);
        }, true);

        $scope.goToMatches = function (section) {
            $location.path('/matches');
        };

        //launch specific match (by ID and section name)
        $scope.launchMatch = function (el) {
            console.log("Launch MATCH>> ", el);
            matches.setSection(el.match.section);
            matches.setMatchId(el.match.match_id);

            $location.path('/matches');
        };

    })
    .controller('SectionSocialCtrl', function ($scope, $location, $route, matches, merges, history, dataservice) {

        $scope.entryType = 'social';

        $scope.setEntryType = function (newEntry) {
            if (newEntry === 'all') {
                $location.path('record');
            } else {
                $location.path('record/' + newEntry);
            }
        };

        $scope.activeSelection = ['active', 'inactive'];
        $scope.toggleSelection = function toggleSelection(buttonName) {
            var idx = $scope.activeSelection.indexOf(buttonName);

            // is currently selected
            if (idx > -1) {
                $scope.activeSelection.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.activeSelection.push(buttonName);
            }
        };

        dataservice.getMatchSection($scope.entryType, function (err, matches) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.masterMatches = matches;
            }
        });

        history.getAccountHistory(function (err, history) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.accountHistory = history;
            }
        });

        function filterEntries(val) {
            console.log("UNFILTERED ", $scope.recordEntries);

            $scope.entryListFiltered = _.where($scope.recordEntries, {
                category: val
            });

            console.log("filtered ", $scope.entryListFiltered);
            console.log("val", val);
            // Filter on active/inactive
            if ($scope.activeSelection.indexOf('active') > -1 && $scope.activeSelection.indexOf('inactive') > -1) { // All entries

            } else if ($scope.activeSelection.indexOf('active') > -1) { // Active only

                $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                    var curDate = new Date();
                    var entryDate = new Date();
                    if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                        entryDate = new Date(entry.data.date_time.high.date);
                    }
                    return (entry.category === val) && (entryDate >= curDate);
                });
            } else if ($scope.activeSelection.indexOf('inactive') > -1) { // Inactive only
                $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                    var curDate = new Date();
                    var entryDate = new Date();
                    if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                        entryDate = new Date(entry.data.date_time.high.date);
                    }
                    return (entry.category === val) && (entryDate < curDate);
                });
            } else { // None
                $scope.entryListFiltered = [];
            }
        }

        dataservice.getProcessedRecord(function (err, processed_record) {
            if (err) {
                console.log("err: " + err);
            } else {
                $scope.recordEntries = _.sortBy(processed_record, function (entry) {
                    if (entry.metadata.datetime[0]) {
                        return entry.metadata.datetime[0].date.substring(0, 9);
                    } else {
                        return '1979-12-12';
                    }
                }).reverse();
                filterEntries($scope.entryType);
            }
        });

        $scope.$watch('activeSelection', function (newVal, oldVal) {
            filterEntries($scope.entryType);
        }, true);
/*
        function refresh() {
            dataservice.curr_section = $scope.entryType;
            dataservice.getData(function () {
                console.log(Date.now(), "MAGIC IS HERE: ", dataservice.processed_record);
                //console.log("MORE: ", dataservice.all_merges, dataservice.merges_record, dataservice.merges_billing);

                pageRender(dataservice.master_record, dataservice.all_notes);
                $scope.masterMatches = dataservice.curr_processed_matches;

                //update merges in scope
                $scope.mergesList_record = dataservice.merges_record;
                $scope.mergesList_billing = dataservice.merges_billing;
                $scope.mergesList = dataservice.all_merges;
            });
        }

        refresh();

        //Flip All as active selected item in DOM
        function getHistory() {
            history.getHistory(function (err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {
                    //console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        }
        getHistory();

        // produces singular name for section name - in records merges list
        $scope.singularName = singularName;

        function pageRender(data, data_notes) {

            function filterEntries(val) {
                console.log("UNFILTERED ", $scope.recordEntries);

                $scope.entryListFiltered = _.where($scope.recordEntries, {
                    category: val
                });

                if ($scope.activeSelection.indexOf('active') > -1 && $scope.activeSelection.indexOf('inactive') > -1) { // All entries

                } else if ($scope.activeSelection.indexOf('active') > -1) { // Active only

                    $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                        var curDate = new Date();
                        var entryDate = new Date();
                        if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                            entryDate = new Date(entry.data.date_time.high.date);
                        }
                        return (entry.category === val) && (entryDate >= curDate);
                    });
                } else if ($scope.activeSelection.indexOf('inactive') > -1) { // Inactive only
                    $scope.entryListFiltered = _.filter($scope.entryListFiltered, function (entry) {
                        var curDate = new Date();
                        var entryDate = new Date();
                        if (angular.isDefined(entry.data.date_time) && angular.isDefined(entry.data.date_time.high)) {
                            entryDate = new Date(entry.data.date_time.high.date);
                        }
                        return (entry.category === val) && (entryDate < curDate);
                    });
                } else { // None
                    $scope.entryListFiltered = [];
                }
                console.log("FILTERED ", $scope.entryListFiltered);
            }

            $scope.recordEntries = dataservice.processed_record;

            $scope.entries = dataservice.master_record;

            $scope.recordEntries = _.sortBy($scope.recordEntries, function (entry) {
                if (entry.metadata.datetime[0]) {
                    return entry.metadata.datetime[0].date.substring(0, 9);
                } else {
                    return '1979-12-12';
                }
            }).reverse();

            filterEntries($scope.entryType);

            $scope.$watch('activeSelection', function (newVal, oldVal) {
                filterEntries($scope.entryType);
            }, true);
        }

        $scope.goToMatches = function (section) {
            $location.path('/matches');
        };
        $scope.launchMatch = function (el) {
            console.log("Launch MATCH>> ", el);
            matches.setSection(el.match.section);
            matches.setMatchId(el.match.match_id);

            $location.path('/matches');
        };

    })
    .controller('SectionOtherCtrl', function ($scope, $location, $modal, $route, matches, merges, history, dataservice) {

        var tempSection = $location.path().split('/');

        $scope.entryType = tempSection[tempSection.length - 1];

        $scope.setEntryType = function (newEntry) {
            if (newEntry === 'all') {
                $location.path('record');
            } else {
                $location.path('record/' + newEntry);
            }
        };

        if (!dataservice.curr_section) {
            dataservice.curr_section = $scope.entryType;
        }

        console.log(Date.now(), " MAGIC OF DATASERVICE STARTS!");

        function refresh() {
            dataservice.curr_section = $scope.entryType;
            dataservice.getData(function () {
                pageRender(dataservice.master_record, dataservice.all_notes);
                $scope.masterMatches = dataservice.curr_processed_matches;

                //update merges in scope
                $scope.mergesList_record = dataservice.merges_record;
                $scope.mergesList_billing = dataservice.merges_billing;
                $scope.mergesList = dataservice.all_merges;
            });
        }

        refresh();

        //Flip All as active selected item in DOM
        function getHistory() {
            history.getHistory(function (err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {
                    //console.log('>>>>accountHistory', history);
                    $scope.accountHistory = history;
                }
            });
        }
        getHistory();

        // produces singular name for section name - in records merges list
        $scope.singularName = singularName;

        function pageRender(data, data_notes) {

            function filterEntries(val) {
                $scope.entryListFiltered = _.where($scope.recordEntries, {
                    category: val
                });
            }

            $scope.recordEntries = dataservice.processed_record;

            $scope.entries = dataservice.master_record;

            $scope.recordEntries = _.sortBy($scope.recordEntries, function (entry) {
                if (entry.metadata.datetime[0]) {
                    return entry.metadata.datetime[0].date.substring(0, 9);
                } else {
                    return '1979-12-12';
                }
            }).reverse();

            $scope.entryType = dataservice.curr_section;

            filterEntries($scope.entryType);

        }
*/
        $scope.goToMatches = function (section) {
            $location.path('/matches');
        };

        //launch specific match (by ID and section name)
        $scope.launchMatch = function (el) {
            matches.setSection(el.match.section);
            matches.setMatchId(el.match.match_id);

            $location.path('/matches');
        };
    });
