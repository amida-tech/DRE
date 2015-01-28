'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the phrPrototypeApp
 */
angular.module('phrPrototypeApp')
  .controller('ProfileCtrl', function ($scope, $location, $anchorScroll, account, profile) {

  	$scope.profile = {};

    $scope.navClick = function (element) {
        var old = $location.hash();
        $location.hash(element);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.updateProfile = function () {
      var info = {
          'email': $scope.profile.email[0].email,
          'firstName': $scope.profile.name.first,
          'middleName': $scope.profile.name.middle[0],
          'lastName': $scope.profile.name.last,
          'dob': $scope.profile.dob,
          'gender': $scope.profile.gender,
          'race_ethnicity': $scope.profile.race_ethnicity,
          'marital_status': $scope.profile.marital_status,
          'religion': $scope.profile.religion,
          'id': $scope.profile._id
      };
      profile.saveProfile(info, function(err) {
        console.log('profile controller', info);
      });
      displayProfile();
    };

    function displayProfile() {
      profile.getProfile(function(err, profileInfo) {
        $scope.profile = profileInfo;
        // console.log('profile controller', $scope.profile._id);
        //Shims for HL7 weirdness.
        var tmpDOB = moment(profileInfo.dob.date).format('YYYY-MM-DD');
        $scope.profile.dob = tmpDOB;
        $scope.user_first = profileInfo.name.first;
        $scope.user_last = profileInfo.name.last;
        $scope.user_email = profileInfo.email[0].email;
        $scope.user_dob = profileInfo.dob;
      });
    }

    displayProfile();


    });



      // var info = {
      //   "name": {
      //       "middle": [$scope.inputMiddle],
      //       "last": $scope.inputLast,
      //       "first": $scope.inputFirst
      //   },
      //   "dob": $scope.inputDOB,
      //   "gender": $scope.inputGender,
      //   "email": [{
      //       "email": $scope.inputEmail,
      //       "type": "primary"
      //   }]
      // };
