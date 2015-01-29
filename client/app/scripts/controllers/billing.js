'use strict';
/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:BillingClaimsCtrl
 * @description
 * # BillingClaimsCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp').controller('BillingCtrl', function($scope, $location, $anchorScroll, claims, insurance, format, profile, billing) {
    $scope.entryType = 'all';
    $scope.masterEntries = [];
    $scope.entries = [];
    $scope.updateDate = null;
    $scope.newComment = {
        'starred': false
    };

    function showUserInfo() {
        profile.getProfile(function(err, profileInfo) {
            $scope.user_first = profileInfo.name.first;
            $scope.user_last = profileInfo.name.last;
            $scope.user_email = profileInfo.email[0].email;
            $scope.user_dob = profileInfo.dob;
        });
    }
    showUserInfo();

    function getUpdateDate() {
        //Should grab from files/update history.  Stubbed for now.
        $scope.updateDate = '12/1/2014';
    }

    function getData() {
        billing.getClaims().then(function(data) {
            $scope.masterEntries.push(data.claims);
        });
        billing.getInsurance().then(function(data) {
            $scope.masterEntries.push(data.insurance);
        });
    }
    getData();
    
    $scope.setEntryType = function(type) {
        $scope.entryType = type;
        if (type === 'all') {
            $scope.entries = $scope.masterEntries;
        } else if (type === 'claims') {
            $scope.entries = $scope.claimsEntries;
        } else if (type === 'insurance') {
            $scope.entries = $scope.insuranceEntries;
        }
    };
});