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

angular.module('phix.inboxService', [])
  .factory('InboxService', function($http) {

    var endpoint = "/";
    var inboxCount = 0;

    function getInboxCount() {
      $http.get(endpoint + 'direct/inbox').success(function(data) {
        var inboxMessages = data.messages;
        var inboxCount = 0;
        for (var i = 0; i < inboxMessages.length; i++) {
          if (inboxMessages[i].read === false) {
            inboxCount = inboxCount + 1;
          }
        }
      }).error(function(data) {});
    }

    getInboxCount();


    return {
      unreadCount: function(callback) {
        $http.get(endpoint + 'direct/inbox').success(function(data) {
          var inboxMessages = data.messages;
          inboxCount = 0;
          for (var i = 0; i < inboxMessages.length; i++) {
            if (inboxMessages[i].read === false) {
              inboxCount = inboxCount + 1;
            }
          }
          callback(inboxCount);
        }).error(function(data) {
          callback(data);
        });
      }
    };

  });