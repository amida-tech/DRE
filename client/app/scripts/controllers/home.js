'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('HomeCtrl', Home);

Home.$inject = ['history', 'merges', 'dataservice'];

function Home(history, merges, dataservice) {
    /* jshint validthis: true */
    var vm = this;
    //TODO : fetch notes and updates counts
    vm.noteCount = 0;
    vm.updatesCount = 0;

    activate();

    function activate() {
        refresh();
        getHistory();
    }

    function refresh() {
        dataservice.curr_section = vm.entryType;
        dataservice.getData(function () {
            vm.noteCount = 0;

            _.each(dataservice.all_notes, function (entry) {
                //console.log(entry);
                if (entry.star) {
                    vm.noteCount++;
                }
            });

            merges.getMerges(function (err, merges) {
                vm.updatesCount = merges.length;
            });
        });
    }
    
    function getHistory() {
        history.getHistory(function (err, history) {
            if (err) {
                console.log('ERRROR', err);
            } else {
                vm.accountHistory = history;
            }
        });
    }
}
