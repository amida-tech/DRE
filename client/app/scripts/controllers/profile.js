'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('ProfileCtrl', function ($scope, $location, $anchorScroll, account) {

  	$scope.profile = {};

    $scope.navClick = function (element) {
        var old = $location.hash();
        $location.hash(element);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

  	account.account(function(err, accountInfo) {

  		
  		$scope.profile = accountInfo;

  		//Shims for HL7 weirdness.
  		var tmpDOB = moment(accountInfo.dob[0].date).format('YYYY-MM-DD');

  		$scope.profile.dob = tmpDOB;
  		$scope.profile.primaryEmail = accountInfo.email[0].email;
  	});

  	//console.log($scope.profile);

  });
