'use strict';

angular.module('phrPrototypeApp').controller('PrintCtrl', function ($scope, $window, $location, format, matches, merges, history, dataservice) {
    console.log("RECORD CONTROLLER LOAD ");

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
    $scope.$watch('tabs.activeTab', function (newVal, oldVal) {
        console.log('TAB CHANGE');
        if (newVal !== oldVal) {
            $scope.$broadcast('tabchange', {
                "val": newVal
            });
        }
    });
    $scope.tabs.activeTab = 0;

    angular.element("#nav" + $scope.entryType).removeClass("active");
    if (!dataservice.curr_section) {
        $scope.entryType = "all";
        dataservice.curr_section = $scope.entryType;
    } else {
        $scope.entryType = dataservice.curr_section;
    }
    angular.element("#nav" + $scope.entryType).addClass("active");

    console.log(Date.now(), " MAGIC OF DATASERVICE STARTS!");

    //TODO may need callback
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
    $scope.singularName = function (section) {
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

    function pageRender(data, data_notes) {

        


        function sortList() {
            $scope.entryList = _.sortBy($scope.entryList, function (entry) {
                return entry.data.date_time.plotDate;
            });
            $scope.entryList.reverse();
        }

        $scope.recordEntries = dataservice.processed_record;
        console.log("processed record ", dataservice.processed_record);
        console.log("master record ", dataservice.master_record);

        $scope.entries = dataservice.master_record;

        console.log(">>> master record ", $scope.entries);

       
        $scope.tabs.activeTab = 0;

        $scope.recordEntries = _.sortBy($scope.recordEntries, function (entry) {
            if (entry.metadata.datetime[0]) {
                return entry.metadata.datetime[0].date.substring(0, 9);
            } else {
                return '1979-12-12';
            }
        }).reverse();


        //$scope.pageLoaded = false;

        if (_.isEmpty(dataservice.curr_section)) {
            $scope.entryType = "all";
        } else {
            $scope.entryType = dataservice.curr_section;
        }

        

        /*
        var delayInMilliseconds = 250;
        setTimeout(function() {
            // Your code here (triggering timeline to reload)
            console.log("page loaded trigger");
            $scope.pageLoaded = !$scope.pageLoaded;

        }, delayInMilliseconds);
        */

    }

    //console.log(">>>>>>", record.masterRecord, record.recordDirty);

    
});
