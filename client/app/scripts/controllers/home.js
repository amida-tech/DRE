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

Home.$inject = ['history', 'dataservice', 'notes'];

function Home(history, dataservice, notes) {
    /* jshint validthis: true */
    var vm = this;
    
    vm.updatesCount = 0;
    vm.noteCount = 0;
    notes.noteCount(function(err,noteCount){
        if (err) {
            console.log("err: ",err);
        } else {
            vm.noteCount = noteCount;
        }
    });

    dataservice.getMergesListRecord(function(err,merges){
        if(err){
            console.log("err: ",err);
        } else {
            vm.updatesCount = merges.length;
        }
    });

    history.getAccountHistory(function (err, history) {
        if (err) {
            console.log('ERRROR', err);
        } else {
            vm.accountHistory = history;
        }
    });
}
