/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('phix.exchangeCtrl', [])
    .controller('ExchangeCtrl', ['$scope', '$http', 'AuthenticationService',
        function($scope, $http, AuthenticationService) {

            $scope.dateformat = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19\d{2}|[2]\d{3})$/;
            //$scope.permissions = [{label: 'All Records', permission: 'all', checked: false},{label: 'Demographics', permission: 'demographics', checked: false},{label: 'Medications', permission: 'medications', checked: false},{label: 'Allergies', permission: 'allergies', checked: false},{label: 'Vitals', permission: 'vitals', checked: false},{label: 'Immunizations', permission: 'immunizations', checked: false},{label: 'Encounters', permission: 'encounters', checked: false},{label: 'Problems', permission: 'problems', checked: false},{label: 'Results', permission: 'results', checked: false}]; 


            $scope.all = false;
            $scope.demographics = false;
            $scope.medications = false;
            $scope.allergies = false;
            $scope.vitals = false;
            $scope.immunizations = false;
            $scope.encounters = false;
            $scope.problems = false;
            $scope.results = false;
            $scope.procedures = false;
            $scope.data = {};
            $scope.data.firstname = '';
            $scope.data.middlename = '';
            $scope.data.lastname = '';
            $scope.data.birthdate = '';
            $scope.serverError = '';

            $scope.patients = [];
            $scope.currentPatient = {};

            $scope.setModalPatient = function(patient) {
                $scope.currentPatient = patient;
            };


            $scope.requestAccess = function() {

                var clinicianUser = {
                    clinicianName: '',
                    clinicianID: '',
                    directemail: ''
                };

                var data_request = {
                    username: $scope.currentPatient.username,
                    clinician: clinicianUser,
                    permissions: {
                        all: $scope.all,
                        demographics: $scope.demographics,
                        medications: $scope.medications,
                        allergies: $scope.allergies,
                        vitals: $scope.vitals,
                        immunizations: $scope.immunizations,
                        encounters: $scope.encounters,
                        problems: $scope.problems,
                        procedures: $scope.procedures,
                        results: $scope.results
                    },
                    er: true,
                    timestamp: new Date()
                };

                AuthenticationService.currentUser(function(response) {
                    data_request.clinician.clinicianName = response.fullname;
                    data_request.clinician.clinicianID = response.username;
                    data_request.clinician.directemail = response.directemail;

                    //if ($scope.all === false && $scope.demographics === false && $scope.medications === false && $scope.allergies === false && $scope.vitals === false && $scope.immunizations === false && $scope.encounters === false && $scope.problems === false && $scope.results === false) {
                    // console.log('No values selected.');   
                    //} else {   
                    $http.put('/hie/dr.joe', {
                        request: data_request
                    }).success(function(data) {
                        console.log(data);
                    }).error(function(data) {
                        console.log(data);
                    });
                    //}
                    $scope.patients = [];
                    $scope.data.firstname = '';
                    $scope.data.middlename = '';
                    $scope.data.lastname = '';
                    $scope.data.birthdate = '';
                    $scope.all = false;
                    $scope.demographics = false;
                    $scope.medications = false;
                    $scope.allergies = false;
                    $scope.vitals = false;
                    $scope.immunizations = false;
                    $scope.encounters = false;
                    $scope.problems = false;
                    $scope.results = false;
                    $scope.procedures = false;
                    $scope.serverError = '';

                });


            };

            $scope.findPatients = function() {

                var lookupJSON = {};

                lookupJSON.firstname = $scope.data.firstname;
                lookupJSON.middlename = $scope.data.middlename;
                lookupJSON.lastname = $scope.data.lastname;
                lookupJSON.birthdate = $scope.data.birthdate;

                $scope.patients = [];
                //$scope.patients = [{fullname: 'Jane Q Doe', city: 'Arlington', state: 'VA', zipcode: '12345', username: 'janedoe'}, {fullname: 'Jane Q Doe', city: 'Duluth', state: 'MN', zipcode: '54321', username: 'janedoe'}]

                //console.log(lookupJSON);

                $http.post('/hie/lookup', lookupJSON).success(function(data) {
                    $scope.patients = data.accounts;
                    if (!$scope.patients) {
                        $scope.serverError = 'No Records found.';
                    } else {
                        $scope.serverError = '';
                    }
                }).error(function(data) {
                    $scope.serverError = data;
                });

            };

        }
    ]);