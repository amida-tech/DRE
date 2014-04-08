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

angular.module('phix.inboxCtrl', ['bt.forms', 'phix.authenticationService'])
  .controller('InboxCtrl', ['$scope', '$http', '$rootScope', '$location', 'AuthenticationService',
    function($scope, $http, $rootScope, $location, AuthenticationService) {


      console.log($rootScope.appConfiguration.configuration);

      if ($rootScope.appConfiguration.configuration === 'clinician') {
        $scope.clinicianConfig = true;
      } else {
        $scope.phixConfig = true;
      }

      $scope.inboxMessages = [];
      $scope.outboundMessage = {};
      $scope.outboundMessage.attachments = [];
      $scope.uploadAttachmentFlag = false;

      $scope.inboxLength = 0;
      $scope.outboxLength = 0;

      $scope.all = false;
      $scope.demographics = false;
      $scope.medications = false;
      $scope.allergies = false;
      $scope.vitals = false;
      $scope.immunizations = false;
      $scope.encounters = false;
      $scope.problems = false;
      $scope.procedures = false;
      $scope.results = false;

      function setInboxLength() {
        $scope.inboxLength = 0;
        for (var i = 0; i < $scope.inboxMessages.length; i++) {
          if ($scope.inboxMessages[i].archived === false) {
            $scope.inboxLength = $scope.inboxLength + 1;
          }
        }
      }

      function setOutboxLength() {
        $scope.outboxLength = 0;
        for (var i = 0; i < $scope.outboxMessages.length; i++) {
          if ($scope.outboxMessages[i].archived === false) {
            $scope.outboxLength = $scope.outboxLength + 1;
          }
        }
      }


      var endpoint = "/";

      function loadInbox() {
        $http.get(endpoint + 'direct/inbox').success(function(data) {
          $scope.inboxMessages = data.messages;
          for (var i = 0; i < $scope.inboxMessages.length; i++) {
            $scope.inboxMessages[i].archived = false;
          }
          setInboxLength();
        }).error(function(data) {
          console.log(data);
        });
      }

      loadInbox();

      function loadOutbox() {
        $http.get(endpoint + 'direct/outbox').success(function(data) {
          $scope.outboxMessages = data.messages;
          for (var i = 0; i < $scope.outboxMessages.length; i++) {
            $scope.outboxMessages[i].archived = false;
          }
          setOutboxLength();
        }).error(function(data) {
          console.log(data);
        });
      }

      loadOutbox();


      if (!$scope.directemail) {
        AuthenticationService.currentUser(function(response) {
          $scope.directemail = response.directemail;
        });
      }

      $scope.patient = !AuthenticationService.clinician;
      $scope.read = {};
      $scope.files = [];
      $scope.modal = {};
      $scope.tab = 'inbox';
      $scope.outbox = [{
        subject: 'Patient Referral',
        receiver: 'Dr. Black',
        received: new Date()
      }];
      var message = {
        '_id': '12345',
        sender: 'Dr. Joe Smith',
        user: 'jane',
        received: new Date(),
        subject: 'my first subject',
        contents: 'Attached is my health record per your request.',
        selected: false,
        archived: false,
        attachments: [{
          name: 'continuation of care',
          extension: 'xml'
        }]
      };

      var senders = ["Dr. Black", "Hospital Lab", "Jane Public", "Dr. Stevenson", "GW Hospital Pediatrics"];
      var subjects = ["Patient Referral", "Lab results", "Updated health record", "re:Patient Referral", "Continuity of care document"];
      $scope.download = function() {};

      $scope.status = {
        all: false
      };

      $scope.reset = function() {
        if ($scope.tab === 'inbox') {
          $.each($scope.inboxMessages, function(index, message) {
            message.selected = $scope.status.all;
          });
        }
        if ($scope.tab === 'outbox') {
          $.each($scope.outboxMessages, function(index, message) {
            message.selected = $scope.status.all;
          });
        }
      };

      $scope.switchTab = function() {
        $scope.status = {
          all: false
        };
        $.each($scope.outboxMessages, function(index, message) {
          message.selected = false;
        });
        $.each($scope.inboxMessages, function(index, message) {
          message.selected = false;
        });
      };

      $scope.allMessages = [];
      //Better looking inbox data
      //for(var i = 0; i < 20; i++) {
      for (var i = 0; i < 5; i++) {
        var nmessage = $.extend({}, message);
        nmessage['_id'] = i;
        //nmessage.subject += i;
        nmessage.subject = subjects[i];
        nmessage.sender = senders[i];
        $scope.allMessages.push(nmessage);
      }

      $scope.pages = [];

      for (var ii = 1; ii < Math.ceil($scope.allMessages.length / 10) + 1; ii++) {
        $scope.pages.push(ii);
      }

      function updatePage(page) {
        $scope.page = page;
        //$scope.messages = $scope.allMessages.slice((page - 1) * 10, page * 10);
      }

      $scope.updatePage = updatePage;

      updatePage(1);

      //$scope.personal = {directemail: 'jane@hub.amida-demo.com'};
      //$scope.personal = {directemail: 'dr.davidson@direct.hospital.com'};
      $scope.read = function(messageId) {

      };
      $scope.selectoAllItems = function() {};


      $scope.clearMessage = function() {
        $scope.outboundMessage = {};
        $scope.outboundMessage.attachments = [];
      };

      function getFiles() {
        $http.get(endpoint + 'storage').success(function(data) {
          $scope.files = [];
          for (var i = 0; i < data.files.length; i++) {
            if (data.files[i].source !== 'outbox') {
              $scope.files.push(data.files[i]);
            }
          }
        }).error(function(data) {
          console.log(data);
        });
      }

      $scope.getFiles = getFiles();

      getFiles();


      $scope.attachFiles = function() {

        for (var i = 0; i < $scope.files.length; i++) {
          if ($scope.files[i].selected === true) {
            var fileAttachment = {
              fileName: $scope.files[i].fileName,
              identifier: $scope.files[i].identifier
            };
            $scope.outboundMessage.attachments.push(fileAttachment);
            fileAttachment = {};
          }
        }

      };

      $scope.markRead = function() {

        function responseFunction (data) {
          console.log(data);
        }

        for (var i = 0; i < $scope.inboxMessages.length; i++) {
          if ($scope.inboxMessages[i].selected === true) {
            if ($scope.inboxMessages[i].read === false) {
              $scope.inboxMessages[i].read = true;
              $http.post(endpoint + 'direct/message/' + $scope.inboxMessages[i].message_id, {
                read: true
              }).success(responseFunction(data)).error(responseFunction(data));
            }
          }
        }
      };

      $scope.markReadOne = function(message) {
        $http.post(endpoint + 'direct/message/' + message.message_id, {
          read: true
        }).success(function(data) {
          //console.log(data);
        }).error(function(data) {
          console.log(data);
        });
      };

      $scope.archive = function(box) {
        var archiveArray = [];
        if (box === 'outbox') {
          for (var i = 0; i < $scope.outboxMessages.length; i++) {
            if ($scope.outboxMessages[i].selected === true) {
              $scope.outboxMessages[i].archived = true;
              archiveArray.push($scope.outboxMessages[i]);
            }
          }
          setOutboxLength();
        } else if (box === 'inbox') {
          for (var ii = 0; ii < $scope.inboxMessages.length; ii++) {
            if ($scope.inboxMessages[ii].selected === true) {
              archiveArray.push($scope.inboxMessages[ii]);
              $scope.inboxMessages[ii].archived = true;
            }
          }
          setInboxLength();
        }

        function responseFunction (data) {
          console.log(data);
        }

        for (var iii = 0; iii < archiveArray.length; iii++) {
          $http.delete(endpoint + 'direct/message/' + archiveArray[iii].message_id).success(responseFunction(data)).error(responseFunction(data));
        }
      };

      $scope.removeMessage = function() {
        $scope.outboundMessage = {};
        $scope.selection = {};
        $scope.part.value = '';
        $scope.all = false;
        $scope.demographics = false;
        $scope.medications = false;
        $scope.allergies = false;
        $scope.vitals = false;
        $scope.immunizations = false;
        $scope.encounters = false;
        $scope.problems = false;
        $scope.procedures = false;
        $scope.results = false;
        document.getElementById('filename').value = "";
      };


      $scope.sendMessage = function() {

        var sendMaster = false;

        //Set to attach master record if picked.
        if ($scope.all || $scope.demographics || $scope.medications || $scope.allergies || $scope.vitals || $scope.immunizations || $scope.encounters || $scope.problems || $scope.procedures || $scope.results) {
          sendMaster = true;
        }

        //Pick up each file attachment and append.
        for (var i = 0; i < $scope.files.length; i++) {
          if ($scope.files[i].selected === true) {
            var fileAttachment = {
              fileName: $scope.files[i].fileName,
              identifier: $scope.files[i].identifier
            };
            $scope.outboundMessage.attachments.push(fileAttachment);
            fileAttachment = {};
          }
        }

        var queryObject = {
          filter: {
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
          }
        };

        if (document.getElementById('filename').files[0]) {
          $scope.uploadAttachmentFlag = true;
        }

        function uploadAttachmentandSend() {
          var f = document.getElementById('filename').files[0];
          var fReader = new FileReader();
          fReader.readAsText(f);
          fReader.onloadend = function(event) {
            var filedata = event.target.result;
            $scope.$apply(function() {
              $http.defaults.headers.post["Content-Type"] = "application/json";
              $http({
                method: 'PUT',
                url: '/storage',
                data: {
                  filename: f.name,
                  file: filedata,
                  source: "upload",
                  details: ''
                }
              }).success(function(data, status, headers, config) {
                //$scope.uploaded=true;
                //$scope.details="";
                //document.getElementById('filename').value="";
                //load_store();
                console.log(data.filename);
                console.log(data.identifier);
                //$scope.outboundMessage.attachments = [];
                $scope.outboundMessage.attachments.push({
                  fileName: data.fileName,
                  identifier: data.identifier
                });
                $http.put(endpoint + 'direct/message', $scope.outboundMessage).success(function(data) {
                  $scope.outboundMessage = {};
                  $scope.selection = {};
                  $scope.part.value = '';
                  loadOutbox();
                  $scope.removeMessage();
                  getFiles();
                }).error(function(data) {
                  console.log(data);
                });

              }).error(function(data, status, headers, config) {
                console.log(data);
              });
            });
          };
        }



        if (sendMaster) {
          $http({
            method: 'POST',
            url: endpoint + 'master/ccda',
            data: queryObject
          }).success(function(data) {
            fileJSON = {
              source: 'outbox',
              details: 'Generated for outbound message.',
              filename: 'bluebutton.xml',
              file: data
            };
            $http.put(endpoint + 'storage', fileJSON).success(function(data) {
              $scope.outboundMessage.attachments.push({
                fileName: data.fileName,
                identifier: data.identifier
              });
              $http.put(endpoint + 'direct/message', $scope.outboundMessage).success(function(data) {
                $scope.outboundMessage = {};
                $scope.selection = {};
                $scope.part.value = '';
                loadOutbox();
                $scope.removeMessage();
                getFiles();
              }).error(function(data) {
                console.log(data);
              });
            }).error(function(data) {
              console.log(data);
            });
          }).error(function(data) {
            console.log(data);
          });
        } else if ($scope.uploadAttachmentFlag) {
          uploadAttachmentandSend();
        } else {
          $http.put(endpoint + 'direct/message', $scope.outboundMessage).success(function(data) {
            $scope.outboundMessage = {};
            $scope.selection = {};
            $scope.part.value = '';
            loadOutbox();
            $scope.removeMessage();
            getFiles();
          }).error(function(data) {
            console.log(data);
          });
        }
      };
    }
  ]);