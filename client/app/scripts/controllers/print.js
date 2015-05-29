'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:PrintCtrl
 * @description
 * # PrintCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('PrintCtrl', Print);

Print.$inject = ['$scope', '$window', '$location', '$timeout', 'format', 'matches', 'merges', 'history', 'dataservice'];

function Print($scope, $window, $location, $timeout, format, matches, merges, history, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    vm.filterBySection = filterBySection;
    vm.lastSection = lastSection;
    vm.section_count = 0;
    vm.singularName = singularName;
    vm.sectionOrder = ["allergies", "medications", "conditions", "procedures", "results", "encounters", "immunizations", "insurance", "claims", "social", "vitals", "print"];
    vm.entryType = 'all';

    //required things: vm.recordEntries, vm.sectionOrder, 

    activate();

    function activate() {        
        function sortList() {
            vm.entryList = _.sortBy(vm.entryList, function (entry) {
                return entry.data.date_time.plotDate;
            });
            vm.entryList.reverse();
        }

        history.getAccountHistory(function (err, history) {
            if (err) {
                console.log("err: " + err);
            } else {
                vm.accountHistory = history;
                $scope.fileUploaded = false;
                _.each(history.recordHistory, function (historyObj) {
                    if (_.includes(historyObj, 'fileUploaded')) {
                        $scope.fileUploaded = true;
                    }
                });
                if ($scope.fileUploaded) {
                    dataservice.getMergesListRecord(function (err, merges_record) {
                        if (err) {
                            console.log("err: " + err);
                        } else {
                            vm.mergesList = merges_record;
                        }
                    });

                    dataservice.getProcessedRecord(vm.entryType, function (err, processed_record) {
                        if (err) {
                            console.log("err: " + err);
                        } else {
                            vm.recordEntries = _.sortBy(processed_record, function (entry) {
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
                                    vm.entries = master_record;
                                    vm.demographics = vm.entries.demographics;
                                    dataservice.getBillingMerges(vm.entryType, function (err, merges_billing) {
                                        vm.mergesList_billing = merges_billing;
                                    });
                                    dataservice.getRecordMerges(vm.entryType, function (err, merges_record) {
                                        vm.mergesList_record = merges_record;
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });

        /*
        function refresh() {
            //dataservice.curr_section = vm.entryType;
            dataservice.getData(function () {
                //console.log(Date.now(), "MAGIC IS HERE: ", dataservice.processed_record);
                //console.log("MORE: ", dataservice.all_merges, dataservice.merges_record, dataservice.merges_billing);
                pageRender(dataservice.master_record, dataservice.all_notes);
                vm.masterMatches = dataservice.curr_processed_matches;
                //update merges in scope
                vm.mergesList_record = dataservice.merges_record;
                vm.mergesList_billing = dataservice.merges_billing;
                vm.mergesList = dataservice.all_merges;
            });
        }

        //Flip All as active selected item in DOM
        function getHistory() {
            history.getHistory(function (err, history) {
                if (err) {
                    console.log('ERRROR', err);
                } else {
                    //console.log('>>>>accountHistory', history);
                    vm.accountHistory = history;
                }
            });
        }

        function pageRender(data, data_notes) {
            
            //vm.recordEntries = dataservice.processed_record;
            console.log("processed record ", dataservice.processed_record);
            console.log("master record ", dataservice.master_record);
            //vm.entries = dataservice.master_record;
            //vm.demographics = vm.entries.demographics;
            console.log(">>> master record ", vm.entries);
            vm.recordEntries = _.sortBy(vm.recordEntries, function (entry) {
                if (entry.metadata.datetime[0]) {
                    return entry.metadata.datetime[0].date.substring(0, 9);
                } else {
                    return '1979-12-12';
                }
            }).reverse();
            //$scope.pageLoaded = false;
            if (_.isEmpty(dataservice.curr_section)) {
                vm.entryType = "all";
            } else {
                vm.entryType = dataservice.curr_section;
            }
            //vm.sectionOrder = ["allergies", "medications", "conditions", "procedures", "results", "encounters", "immunizations", "insurance", "claims", "social", "vitals", "print"];
        }
        */
    }

    function filterBySection(entries, section) {
        return _.where(entries, {
            category: section
        });
    }

    function lastSection(last) {
        console.log('last?', last);
    }

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
}
