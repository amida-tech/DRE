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

  	$scope.editContact = false;
    $scope.editLangs = false;
    $scope.editProf = false;

    $scope.editContactSection = function () {
      $scope.editContact = true;
    }

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
        // console.log('profile controller', info);
      });
      $scope.editContact = false;
      // editContactSection();
      // displayProfile();
    }

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

        // hard coded language
        if ($scope.profile.languages[0].language === 'en') {
          $scope.user_language = 'English';
        }

      });
    }

    displayProfile();


    });


