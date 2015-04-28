'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.openfda
 * @description
 * # openfda
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp').service('openfda', function openfda($http) {
	
	this.getFDAdata = function(rxNormCode, callback) {
		$http.get('api/v1/openfda')
			.success(function (data) {
				callback(null, data)
			}).error(function (err) {
				callback(err);
			});

	};

});