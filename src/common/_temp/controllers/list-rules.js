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

angular.module('phix.listRulesCtrl', ['bt.forms', 'phix.selectClinitian', 'phix.selectPerson'])
  .controller('ListRulesCtrl', ['$http', '$scope',
    function($http, $scope) {

      var endpoint = "/";
      $scope.delegates = [];
      $scope.validUser = false;
      $scope.referenceName = '';
      $scope.currentDelegate = '';
      $scope.currentPendingAuthorization = '';
      $scope.currentAuthorization = '';
      $scope.pendingAuthorizations = [];
      $scope.currentPermissions = {};
      $scope.authorizations = [];

      function getDelegates() {
        $http.get(endpoint + 'delegation/granted').success(function(data) {
          $scope.delegates = data.delegates;
          //console.log($scope.delegates[0].granted);
          //$scope.delegates[0].myDate = new Date($scope.delegates[0].granted))
        }).error(function(data) {
          $scope.delegates = [];
        });
      }

      function getAuthorizations() {
        $http.get(endpoint + 'access').success(function(data) {
          for (var i = 0; i < data.approvedRequests.length; i++) {
            var authorizationString = '';
            var spacer = '';
            if (data.approvedRequests[i].permissions.all) {
              authorizationString = 'All Records';
            } else {
              if (data.approvedRequests[i].permissions.allergies) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Allergies';
              }
              if (data.approvedRequests[i].permissions.encounters) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Encounters';
              }
              if (data.approvedRequests[i].permissions.immunizations) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Immunizations';
              }
              if (data.approvedRequests[i].permissions.medications) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Medications';
              }
              if (data.approvedRequests[i].permissions.problems) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Problems';
              }
              if (data.approvedRequests[i].permissions.procedures) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Procedures';
              }
              if (data.approvedRequests[i].permissions.results) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Results';
              }
              if (data.approvedRequests[i].permissions.vitals) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Vitals';
              }
              if (authorizationString.length === 0) {
                authorizationString = 'None';
              }
            }
            data.approvedRequests[i].authorizationString = authorizationString;
            $scope.authorizations = data.approvedRequests;
          }
        }).error(function(data) {
          $scope.authorizations = [];
          console.log(data);
        });
      }



      function getPendingAuthorizations() {
        $http.get(endpoint + 'access/pending').success(function(data) {
          for (var i = 0; i < data.pendingRequests.length; i++) {
            var authorizationString = '';
            var spacer = '';
            if (data.pendingRequests[i].permissions.all) {
              authorizationString = 'All Records';
            } else {
              if (data.pendingRequests[i].permissions.allergies) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Allergies';
              }
              if (data.pendingRequests[i].permissions.encounters) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Encounters';
              }
              if (data.pendingRequests[i].permissions.immunizations) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Immunizations';
              }
              if (data.pendingRequests[i].permissions.medications) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Medications';
              }
              if (data.pendingRequests[i].permissions.problems) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Problems';
              }
              if (data.pendingRequests[i].permissions.procedures) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Procedures';
              }
              if (data.pendingRequests[i].permissions.results) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Results';
              }
              if (data.pendingRequests[i].permissions.vitals) {
                spacer = '';
                if (authorizationString.length > 0) {
                  spacer = ', ';
                }
                authorizationString = authorizationString + spacer + 'Vitals';
              }
              if (authorizationString.length === 0) {
                authorizationString = 'None';
              }
            }
            data.pendingRequests[i].authorizationString = authorizationString;
            $scope.pendingAuthorizations = data.pendingRequests;
          }
        }).error(function(data) {
          $scope.pendingAuthorizations = [];
          console.log(data);
        });
      }

      getDelegates();
      getPendingAuthorizations();
      getAuthorizations();

      $scope.grantPendingAuthorization = function() {
        $http.post(endpoint + 'access/pending/' + $scope.currentPendingAuthorization.clinicianID).success(function(data) {
          getPendingAuthorizations();
          getAuthorizations();
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.denyPendingAuthorization = function() {
        $http.delete(endpoint + 'access/pending/' + $scope.currentPendingAuthorization.clinicianID).success(function(data) {
          getPendingAuthorizations();
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.removeAuthorization = function() {
        console.log($scope.currentAuthorization);
        $http.delete(endpoint + 'access/' + $scope.currentAuthorization.clinicianID).success(function(data) {
          getAuthorizations();
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.updateAuthorization = function(currentPermissions) {

        var updateResponse = {};
        updateResponse.permissions = currentPermissions;

        $http.post(endpoint + 'access/' + $scope.currentAuthorization.clinicianID, updateResponse).success(function(data) {
          getAuthorizations();
        }).error(function(data) {
          console.log(data);
        });
      };



      $scope.setCurrentPendingAuthorization = function(currentPendingAuthorization) {
        $scope.currentPendingAuthorization = currentPendingAuthorization;
      };

      $scope.setCurrentAuthorization = function(currentAuthorization) {
        $scope.currentAuthorization = currentAuthorization;
        console.log($scope.currentAuthorization);
      };

      $scope.setCurrentPermissions = function(currentPermissions) {
        $scope.currentPermissions = currentPermissions;
      };



      $scope.clearReferenceName = function() {
        $scope.referenceName = '';
        $scope.validUser = false;
        $scope.fullname = '';
      };

      $scope.setcurrentDelegate = function(currentDelegate) {
        $scope.currentDelegate = currentDelegate;
      };

      $scope.revokeDelegate = function() {
        $http.delete(endpoint + 'delegation/' + $scope.currentDelegate).success(function(data) {
          getDelegates(function(results) {
            $scope.delegates = results.delegates;
          });
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.submitDelegate = function() {
        $http.put(endpoint + 'delegation/' + $scope.referenceName).success(function(data) {
          //refresh delegate list.
          $scope.referenceName = '';
          $scope.fullname = '';
          getDelegates(function(results) {
            $scope.delegates = results.delegates;

          });
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.userCheck = function() {
        $scope.fullname = '';
        if ($scope.referenceName.length > 4) {
          $http.post(endpoint + 'validuser', {
            username: $scope.referenceName
          }).success(function(data) {
            $scope.validUser = true;
            if (data.middlename) {
              $scope.fullname = data.firstname + " " + data.middlename.substring(0, 1) + ". " + data.lastname;
            } else {
              $scope.fullname = data.firstname + " " + data.lastname;
            }
          }).error(function(data) {
            $scope.validUser = false;
          });
        }
      };

      $scope.checked = [{
        name: 'encounters',
        checked: false
      }, {
        name: 'vitals',
        checked: false
      }, {
        name: 'labs',
        checked: false
      }, {
        name: 'medications',
        checked: false
      }, {
        name: 'immunizations',
        checked: false
      }, {
        name: 'allergies',
        checked: false
      }, {
        name: 'problems',
        checked: false
      }, {
        name: 'all',
        checked: false
      }];

      $scope.clicked = function(type) {
        if (type === 'all') {
          var i = 0;
          if ($scope.checked[$scope.checked.length - 1].checked) {
            for (; i < $scope.checked.length - 2; i++) {
              $scope.checked[i].checked = false;
            }
          } else {
            for (; i < $scope.checked.length - 2; i++) {
              $scope.checked[i].checked = true;
            }
          }
        }
      };
    }
  ]);