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

angular.module('phix.authenticationService', [])
  .factory('AuthenticationService', function($http) {

    var endpoint = "/";
    var userObject = {};
    var role;


    function getUser() {
      $http.get(endpoint + 'account').success(function(data) {
        userObject = data;
      }).error(function(data) {
        console.log(data);
      });
    }

    getUser();


    return {
      logout: function(callback) {
        $http.post(endpoint + 'logout').success(function(data) {
          auth = false;
          role = '';
          delegates = [];
          name = '';
          username = '';
          callback();
        }).error(function(data) {
          auth = true;
          callback();
        });
      },
      login: function(user, pass, callback) {
        $http.post(endpoint + 'login', {
          username: user,
          password: pass
        }).success(function(data) {
          auth = true;
          callback(null, data);
        }).error(function(data) {
          auth = false;
          callback(data);
        });
        // Original coding from Michael.
        /* } else if (user == 'joe') {
          auth = true;
          delegates = [];
          role = 'clinician';
          name = 'Dr. Joe Davidson';
          username = user;
        } else {
          auth = true;
          name = 'Jane Public';
          username = user;
          delegates = [
            {
              name: 'Eric Public',
              username: 'eric'
            },
            {
              name: 'David Public',
              username: 'david'
            },
            {
              name: 'Francie Public',
              username: 'francie'
            }
          ];
          role = 'patient';
        }*/
      },
      clinician: function() {
        return role === 'clinician';
      },
      delegates: function(callback) {
        $http.get(endpoint + 'delegation/recieved').success(function(data) {
          callback(data);
        }).error(function(data) {
          callback(data);
        });
      },
      authenticated: function(callback) {
        $http.get(endpoint + 'loggedin').success(function(data) {
          auth = true;
          callback(auth);
        }).error(function(data) {
          auth = false;
          callback(auth);
        });

      },
      currentDelegate: function(username, callback) {
        if (username !== undefined) {
          $http.get('/switch/' + username).success(function(data) {
            callback(data);
          }).error(function(data) {
            callback(data);
          });
        }
      },
      currentUser: function(callback) {
        if (userObject = {}) {
          $http.get(endpoint + 'account').success(function(data) {
            userObject = data;
            callback(userObject);
          }).error(function(data) {
            console.log(data);
          });
        } else {
          callback(userObject);
        }
      }
    };
  });