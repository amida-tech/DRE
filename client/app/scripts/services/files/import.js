'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.files/upload
 * @description
 * # files/upload
 * Service in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .service('importService', importService);

importService.$inject = ['$http', 'dataservice', 'history', 'notes'];

function importService($http, dataservice, history, notes) {
    /* jshint validthis: true */
}
