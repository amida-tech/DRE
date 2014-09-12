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

angular.module('dre.record.insurance', [])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/record/insurance', {
            templateUrl: 'templates/record/components/insurance.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('insuranceCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function ($scope, $http, $location, recordFunctions) {

        $scope.insurance = [];
        $scope.displayInsurance = false;
        $scope.insurancePredicate = "-date_weight";

        $scope.getRecord = function () {
            $http({
                method: 'GET',
                url: '/api/v1/record/payers'
            }).
            success(function (data, status, headers, config) {
                $scope.insurance = data.payers;
                if ($scope.insurance.length > 0) {
                    $scope.displayInsurance = true;
                    $scope.updateFields();
                } else {
                    $scope.displayInsurance = false;
                }
            }).
            error(function (data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.updateFields = function () {

            console.log($scope.insurance);

            for (var i in $scope.insurance) {
                recordFunctions.extractName($scope.insurance[i], "insurance");

                if ($scope.insurance[i].participant) {
                    if ($scope.insurance[i].participant.date_time) {
                        recordFunctions.formatDateTime($scope.insurance[i].participant.date_time);
                    }
                    if ($scope.insurance[i].participant.name) {
                        for (var iName in $scope.insurance[i].participant.name) {
                            recordFunctions.formatName($scope.insurance[i].participant.name[iName]);
                        }
                    }
                    if ($scope.insurance[i].participant.performer) {

                        if ($scope.insurance[i].participant.performer.address) {
                            for (var iAddr in $scope.insurance[i].participant.performer.address) {
                                recordFunctions.formatAddress($scope.insurance[i].participant.performer.address[iAddr]);
                            }
                        }
                    }
                }

                if ($scope.insurance[i].participant.date_time) {
                    $scope.insurance[i].attribute = $scope.insurance[i].participant.date_time.low.displayDate;
                } else {
                    $scope.insurance[i].attribute = 'DATE NOT REPORTED';
                }




                if ($scope.insurance[i].policy) {
                    if ($scope.insurance[i].policy.insurance) {
                        if ($scope.insurance[i].policy.insurance.performer) {
                            if ($scope.insurance[i].policy.insurance.performer.organization) {
                                if ($scope.insurance[i].policy.insurance.performer.organization[0].address) {
                                    for (var iOrgAddr in $scope.insurance[i].policy.insurance.performer.organization[0].address) {
                                        recordFunctions.formatAddress($scope.insurance[i].policy.insurance.performer.organization[0].address[iOrgAddr]);
                                    }
                                }
                            }
                        }
                    }
                }

                if ($scope.insurance[i].policy_holder) {
                    if ($scope.insurance[i].policy_holder.performer) {
                        if ($scope.insurance[i].policy_holder.performer.address) {
                            for (var iPHAddr in $scope.insurance[i].policy_holder.performer.address) {
                                recordFunctions.formatAddress($scope.insurance[i].policy_holder.performer.address[iPHAddr]);
                            }
                        }
                    }
                }
                if ($scope.insurance[i].guarantor) {
                        if ($scope.insurance[i].guarantor.address) {
                            for (var iGAddr in $scope.insurance[i].guarantor.address) {
                                recordFunctions.formatAddress($scope.insurance[i].guarantor.address[iGAddr]);
                            }
                        }
                        if ($scope.insurance[i].guarantor.name) {
                        for (var iGName in $scope.insurance[i].guarantor.name) {
                            recordFunctions.formatName($scope.insurance[i].guarantor.name[iGName]);
                        }
                    }
                }

                //recordFunctions.formatDateTime($scope.insurance[i].date_time);
                //$scope.insurance[i].date_weight = $scope.insurance[i].date_time;
                $scope.insurance[i].name = recordFunctions.truncateName($scope.insurance[i].name);
                if ($scope.insurance[i].addresses) {
                    for (var perAddr in $scope.insurance[i].addresses) {
                        recordFunctions.formatAddress($scope.insurance[i].addresses[perAddr]);
                    }
                }
            }
        };

        $scope.getRecord();
        //$scope.getStub();

    }
]);