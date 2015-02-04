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
    $scope.user_language = {};

    $scope.editContactSection = function () {
      $scope.editContact = true;
    };
    $scope.cancelContact = function () {
      $scope.editContact = false;
    };

    $scope.editProfSection = function () {
      $scope.editProf = true;
    };
    $scope.cancelProf = function () {
      $scope.editProf = false;
    };

    $scope.editLangsSection = function () {
      $scope.editLangs = true;
    };
    $scope.cancelLangs = function () {
      $scope.editLangs = false;
    };

    $scope.navClick = function (element) {
        var old = $location.hash();
        $location.hash(element);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.updateProfile = function () {
      if (angular.isDefined($scope.new_language)) {
        addLang();
      }
      addContact();


      var info = $scope.profile;
      var tmpemail = {
          "type": "primary",
          "email": $scope.profile.email[0].email
      };

      $scope.profile.email[0] = tmpemail;

      var formatdob = moment($scope.tmpDOB).format('YYYY-MM-DDTHH:mmZ');
      $scope.profile.dob = {
        "date": formatdob,
        "precision": "day"
      };

      profile.saveProfile(info, function(err) {
        // console.log('profile controller', info);
      });
      $scope.editContact = false;
      $scope.editLangs = false;
      $scope.editProf = false;
    };

    function displayProfile() {
      profile.getProfile(function(err, profileInfo) {
        $scope.profile = profileInfo;
        // console.log('profile controller', $scope.profile._id);
        //Shims for HL7 weirdness.
        if (profileInfo&&profileInfo.dob) {
        $scope.tmpDOB = moment($scope.profile.dob.date).format('YYYY-MM-DD');

        // hard coded language
        if (angular.isDefined($scope.profile.languages)) {
        for (var index in $scope.profile.languages) {
          if ($scope.profile.languages[index].language === 'en') {
            $scope.user_language[index] = 'English';
          }
        }
        }
      }

      });
    }

    displayProfile();

    function addLang() {
        // add new language
        if ($scope.new_language.language === 'English') {
          $scope.new_language.language = 'en';
        }
        var tmpLanguages =
          {'languages': $scope.new_language};
          if (angular.isDefined($scope.profile.languages)) {
            var lang_count = $scope.profile.languages.length;
            // console.log(lang_count);
            $scope.profile.languages[lang_count] = $scope.new_language;
          } else {
            var tmpProf = $scope.profile;
            $scope.profile = tmpProf + tmpLanguages;
            // console.log(tmpLanguages, $scope.new_language, $scope.profile, tmpProf);
          }
      }

      function addContact() {
        if (angular.isDefined($scope.new_phone)) {
          var tmpPhone =
            {'phone': $scope.new_phone};
          if (angular.isDefined($scope.profile.phone)) {
            var phone_count = $scope.profile.phone.length;
            $scope.profile.phone[phone_count] = $scope.new_phone;
          } else {
            var tmpProf1 = $scope.profile;
            $scope.profile = tmpProf1 + tmpPhone;
          }
        }

        if (angular.isDefined($scope.new_email)) {
          var tmpNewEmail =
            {'email': $scope.new_email};
          var email_count = $scope.profile.email.length;
          $scope.profile.email[email_count] = $scope.new_email;
          
        }

      }

    });


