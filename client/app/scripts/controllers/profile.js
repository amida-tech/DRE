/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('ProfileCtrl', Profile);

Profile.$inject = ['$location', '$route', '$anchorScroll', 'account', 'profile', 'format'];

function Profile ($location, $route, $anchorScroll, account, profile, format) {
    /* jshint validthis: true */
    var vm = this;
    vm.cancelAddressSection = cancelAddressSection;
    vm.cancelPhoneSection = cancelPhoneSection;
    vm.cancelProf = cancelProf;
    vm.editAddress = false;
    vm.editAddressSection = editAddressSection;
    vm.editPhone = false;
    vm.editPhoneSection = editPhoneSection;
    vm.editProf = false;
    vm.editProfSection = editProfSection;
    vm.navClick = navClick;
    vm.updateProfile = updateProfile;
    
    activate();
    
    function activate() {
        displayProfile();
    }
    
    function editAddressSection() {
        vm.editAddress = true;
    }
    
    function cancelAddressSection() {
        vm.editAddress = false;
        vm.new_address = {};
        displayProfile();
    }

    function editPhoneSection() {
        vm.editPhone = true;
    }
    
    function cancelPhoneSection() {
        vm.editPhone = false;
        vm.new_phone = {};
        displayProfile();
    }

    function editProfSection() {
        vm.editProf = true;
    }
    
    function cancelProf() {
        vm.editProf = false;
        displayProfile();
    }

    function navClick(element) {
        var old = $location.hash();
        $location.hash(element);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    }

    function updateProfile() {
        // if (angular.isDefined(vm.new_language)) {
        //   addLang();
        // }
        addAddress();
        addPhone();

        var info = vm.profile;
        var tmpemail = {
            "type": "primary",
            "email": vm.profile.email[0].email
        };

        vm.profile.email[0] = tmpemail;

        var formatdob = moment(vm.editDOB).format('YYYY-MM-DD');
        vm.profile.dob = {
            "point": {
                "date": formatdob,
                "precision": "day"
            }
        };
        if (vm.tmpMiddleName) {
            // var tmpMiddleName = vm.profile.name.middle;
            vm.profile.name.middle = [];
            vm.profile.name.middle[0] = vm.tmpMiddleName;
        } else {
            //remove name if it is empty string
            vm.profile.name.middle = [];
            delete vm.profile.name.middle;
        }

        // console.log(vm.tmpDOB, vm.profile.dob);
        profile.saveProfile(info, function (err) {
            $route.reload();
            // displayProfile();
            // console.log('profile controller', info);
        });
        vm.editAddress = false;
        vm.editPhone = false;
        // vm.editLangs = false;
        vm.editProf = false;

    }

    function displayProfile() {
        profile.getProfile(function (err, profileInfo) {
            vm.profile = profileInfo;
            //console.log('profile controller', vm.profile);
            //Shims for HL7 weirdness.
            if (profileInfo && profileInfo.dob) {
                vm.editDOB = moment(vm.profile.dob.point.date).format('YYYY-MM-DD');
                vm.viewDOB = format.formatDate(vm.profile.dob.point);
            }
            if (profileInfo && profileInfo.name.middle) {
                vm.tmpMiddleName = profileInfo.name.middle[0];
            }

        });
    }

    function addPhone() {
        if (angular.isDefined(vm.new_phone)) {
            var tmpPhone = {
                "number": vm.new_phone.number,
                "type": vm.new_phone.type
            };
            if (angular.isDefined(vm.profile.phone)) {
                var phone_count = vm.profile.phone.length;
                vm.profile.phone[phone_count] = vm.new_phone;
                vm.new_phone = {};
            } else {
                vm.profile.phone = [];
                vm.profile.phone[0] = tmpPhone;
                //console.log(vm.tmpNewPhone, vm.new_phone);
                vm.new_phone = {};
            }
        }
    }

    function addAddress() {
        console.log("vm.new_address ", vm.new_address);
        if (angular.isDefined(vm.new_address)) {
            var tmpNewAddress = {
                "city": vm.new_address.city,
                "state": vm.new_address.state,
                "zip": vm.new_address.zip,
                "country": vm.new_address.country,
                "use": vm.new_address.use
            };
            if (vm.new_address.street_line1) {
                tmpNewAddress.street_lines = [];
                tmpNewAddress.street_lines[0] = vm.new_address.street_line1;
            }

            if (angular.isDefined(vm.profile.addresses)) {
                var addresses_count = vm.profile.addresses.length;
                vm.profile.addresses[addresses_count] = vm.new_address;
                vm.new_address = {};
            } else {
                vm.profile.addresses = [];
                vm.profile.addresses[0] = tmpNewAddress;
                //console.log(vm.tmpNewAddress, vm.new_address);
                vm.new_address = {};
            }

        }

    }

}

