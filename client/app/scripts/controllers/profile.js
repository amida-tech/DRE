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
      var info = $scope.profile;
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
        if (profileInfo.dob.date) {
          var tmpDOB = moment(profileInfo.dob.date).format('YYYY-MM-DD');
          $scope.profile.dob = tmpDOB;
        } 
      });
    }

    displayProfile();


    });


          // 'email': $scope.profile.email[0].email,
          // 'firstName': $scope.profile.name.first,
          // 'middleName': $scope.profile.name.middle[0],
          // 'lastName': $scope.profile.name.last,
          // 'dob': $scope.profile.dob,
          // 'gender': $scope.profile.gender,
          // 'race_ethnicity': $scope.profile.race_ethnicity,
          // 'marital_status': $scope.profile.marital_status,
          // 'religion': $scope.profile.religion,
          // 'db_id': $scope.profile._id,
          // 'record_id': $scope.profile.metadata.attribution[0].record._id


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
