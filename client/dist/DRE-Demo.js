/*! DRE-Demo - v1.0.0 - 2014-12-12
 * Copyright (c) 2014 Dmitry Kachaev, Matthew McCall and Afsin Ustundag;
 * Licensed Apache 2.0
 */

var dre = angular
    .module('dre', [
        'ngRoute',
        'dre.home',
        'dre.record',
        'dre.storage',
        'dre.dashboard',
        'dre.demographics',
        'dre.login',
        'dre.match',
        'dre.match.review_new',
        //'dre.match.review_old',
        'dre.nav',
        'dre.register',
        'directives.fileModel',
        'directives.matchingObjects',
        'services.account',
        'services.fileUpload',
        'services.fileDownload',
        'services.getNotifications',
        'services.recordFunctions',
    ])
    .filter('bb_date', function($filter) {
        //Format Blue Button date JSON struct into string (with precision)

        return function(input_date) {
            if (typeof input_date === "undefined") {
                return "";
            }

            var tmpDateArr;
            if (input_date.precision === "year") {
                tmpDateArr = $filter('date')(input_date.date, 'yyyy');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "month") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM, yyyy');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "day") {
                tmpDateArr = $filter('date')(input_date.date, 'mediumDate');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "hour") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "minute") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "second") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "subsecond") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }

            return tmpDateArr;
        };
    })    
.filter('bb_trunc', function($filter) {
        //Format Blue Button OIDs (by truncating them)

        return function(oid) {
            if (typeof oid === "undefined") {
                return "";
            }

            if (oid.length > 13) {
                oid =  "..."+oid.substring(oid.length-10, oid.length);
                //console.log(inputName);
            }

            return oid;
        };
    })
.filter('bb_trunc2', function($filter) {
        //Format Blue Button Result Set names (by truncating them)

        return function(oid) {
            if (typeof oid === "undefined") {
                return "";
            }

            if (oid.length > 13) {
                oid =  oid.substring(0, 10)+"...";
                //console.log(inputName);
            }

            return oid;
        };
    })    .filter('bb_name', function($filter) {
        //Format Blue Button name JSON struct into string

        return function(input_name) {
            if (typeof input_name === "undefined") {
                return "";
            }

            var full_name;

            if (input_name.first) {
                full_name = input_name.first + " ";
            }

            if (input_name.middle && input_name.middle.length > 0) {
                for (var m in input_name.middle) {
                    full_name = full_name + input_name.middle[m] + " ";
                }
            }

            if (input_name.last) {
                full_name = full_name + input_name.last;
            }

            full_name = full_name.trim();


            return full_name;
        };
    })
    .filter('bb_language', function($filter) {
        //Format Blue Button language code into human readable string

        return function(lang) {
            if (typeof lang === "undefined") {
                return "";
            }

            switch (lang) {
                case "en":
                    return "English";
                case "eng":
                    return "English";

                case "aa":
                    return "Afar";
                case "ab":
                    return "Abkhazian";
                case "ae":
                    return "Avestan";
                case "af":
                    return "Afrikaans";
                case "ak":
                    return "Akan";
                case "am":
                    return "Amharic";
                case "an":
                    return "Aragonese";
                case "ar":
                    return "Arabic";
                case "as":
                    return "Assamese";
                case "av":
                    return "Avaric";
                case "ay":
                    return "Aymara";
                case "az":
                    return "Azerbaijani";
                case "ba":
                    return "Bashkir";
                case "be":
                    return "Belarusian";
                case "bg":
                    return "Bulgarian";
                case "bh":
                    return "Bihari";
                case "bi":
                    return "Bislama";
                case "bm":
                    return "Bambara";
                case "bn":
                    return "Bengali";
                case "bo":
                    return "Tibetan";
                case "bo":
                    return "Tibetan";
                case "br":
                    return "Breton";
                case "bs":
                    return "Bosnian";
                case "ca":
                    return "Catalan";
                case "ce":
                    return "Chechen";
                case "ch":
                    return "Chamorro";
                case "co":
                    return "Corsican";
                case "cr":
                    return "Cree";
                case "cs":
                    return "Czech";
                case "cs":
                    return "Czech";
                case "cu":
                    return "Church Slavic";
                case "cv":
                    return "Chuvash";
                case "cy":
                    return "Welsh";
                case "cy":
                    return "Welsh";
                case "da":
                    return "Danish";
                case "de":
                    return "German";
                case "de":
                    return "German";
                case "dv":
                    return "Divehi";
                case "dz":
                    return "Dzongkha";
                case "ee":
                    return "Ewe";
                case "el":
                    return "Greek";
                case "eo":
                    return "Esperanto";
                case "es":
                    return "Spanish";
                case "et":
                    return "Estonian";
                case "eu":
                    return "Basque";
                case "eu":
                    return "Basque";
                case "fa":
                    return "Persian";
                case "fa":
                    return "Persian";
                case "ff":
                    return "Fulah";
                case "fi":
                    return "Finnish";
                case "fj":
                    return "Fijian";
                case "fo":
                    return "Faroese";
                case "fr":
                    return "French";
                case "fr":
                    return "French";
                case "fy":
                    return "Western Frisian";
                case "ga":
                    return "Irish";
                case "gd":
                    return "Gaelic";
                case "gl":
                    return "Galician";
                case "gn":
                    return "Guarani";
                case "gu":
                    return "Gujarati";
                case "gv":
                    return "Manx";
                case "ha":
                    return "Hausa";
                case "he":
                    return "Hebrew";
                case "hi":
                    return "Hindi";
                case "ho":
                    return "Hiri Motu";
                case "hr":
                    return "Croatian";
                case "ht":
                    return "Haitian";
                case "hu":
                    return "Hungarian";
                case "hy":
                    return "Armenian";
                case "hy":
                    return "Armenian";
                case "hz":
                    return "Herero";
                case "ia":
                    return "Interlingua";
                case "id":
                    return "Indonesian";
                case "ie":
                    return "Interlingue";
                case "ig":
                    return "Igbo";
                case "ii":
                    return "Sichuan Yi";
                case "ik":
                    return "Inupiaq";
                case "io":
                    return "Ido";
                case "is":
                    return "Icelandic";
                case "is":
                    return "Icelandic";
                case "it":
                    return "Italian";
                case "iu":
                    return "Inuktitut";
                case "ja":
                    return "Japanese";
                case "jv":
                    return "Javanese";
                case "ka":
                    return "Georgian";
                case "ka":
                    return "Georgian";
                case "kg":
                    return "Kongo";
                case "ki":
                    return "Kikuyu";
                case "kj":
                    return "Kuanyama";
                case "kk":
                    return "Kazakh";
                case "kl":
                    return "Kalaallisut";
                case "km":
                    return "Central Khmer";
                case "kn":
                    return "Kannada";
                case "ko":
                    return "Korean";
                case "kr":
                    return "Kanuri";
                case "ks":
                    return "Kashmiri";
                case "ku":
                    return "Kurdish";
                case "kv":
                    return "Komi";
                case "kw":
                    return "Cornish";
                case "ky":
                    return "Kirghiz";
                case "la":
                    return "Latin";
                case "lb":
                    return "Luxembourgish";
                case "lg":
                    return "Ganda";
                case "li":
                    return "Limburgan";
                case "ln":
                    return "Lingala";
                case "lo":
                    return "Lao";
                case "lt":
                    return "Lithuanian";
                case "lu":
                    return "Luba-Katanga";
                case "lv":
                    return "Latvian";
                case "mg":
                    return "Malagasy";
                case "mh":
                    return "Marshallese";
                case "mi":
                    return "Maori";
                case "mi":
                    return "Maori";
                case "mk":
                    return "Macedonian";
                case "mk":
                    return "Macedonian";
                case "ml":
                    return "Malayalam";
                case "mn":
                    return "Mongolian";
                case "mr":
                    return "Marathi";
                case "ms":
                    return "Malay";
                case "ms":
                    return "Malay";
                case "mt":
                    return "Maltese";
                case "my":
                    return "Burmese";
                case "my":
                    return "Burmese";
                case "na":
                    return "Nauru";
                case "nb":
                    return "Norwegian";
                case "nd":
                    return "North Ndebele";
                case "ne":
                    return "Nepali";
                case "ng":
                    return "Ndonga";
                case "nl":
                    return "Dutch; Flemish";
                case "nl":
                    return "Dutch; Flemish";
                case "nn":
                    return "Norwegian Nynorsk";
                case "no":
                    return "Norwegian";
                case "nr":
                    return "South Ndebele";
                case "nv":
                    return "Navajo";
                case "ny":
                    return "Chichewa";
                case "oc":
                    return "Occitan";
                case "oj":
                    return "Ojibwa";
                case "om":
                    return "Oromo";
                case "or":
                    return "Oriya";
                case "os":
                    return "Ossetian";
                case "pa":
                    return "Panjabi";
                case "pi":
                    return "Pali";
                case "pl":
                    return "Polish";
                case "ps":
                    return "Pashto";
                case "pt":
                    return "Portuguese";
                case "qu":
                    return "Quechua";
                case "rm":
                    return "Romansh";
                case "rn":
                    return "Rundi";
                case "ro":
                    return "Romanian";
                case "ru":
                    return "Russian";
                case "rw":
                    return "Kinyarwanda";
                case "sa":
                    return "Sanskrit";
                case "sc":
                    return "Sardinian";
                case "sd":
                    return "Sindhi";
                case "se":
                    return "Northern Sami";
                case "sg":
                    return "Sango";
                case "si":
                    return "Sinhala";
                case "sk":
                    return "Slovak";
                case "sk":
                    return "Slovak";
                case "sl":
                    return "Slovenian";
                case "sm":
                    return "Samoan";
                case "sn":
                    return "Shona";
                case "so":
                    return "Somali";
                case "sq":
                    return "Albanian";
                case "sq":
                    return "Albanian";
                case "sr":
                    return "Serbian";
                case "ss":
                    return "Swati";
                case "st":
                    return "Sotho, Southern";
                case "su":
                    return "Sundanese";
                case "sv":
                    return "Swedish";
                case "sw":
                    return "Swahili";
                case "ta":
                    return "Tamil";
                case "te":
                    return "Telugu";
                case "tg":
                    return "Tajik";
                case "th":
                    return "Thai";
                case "ti":
                    return "Tigrinya";
                case "tk":
                    return "Turkmen";
                case "tl":
                    return "Tagalog";
                case "tn":
                    return "Tswana";
                case "to":
                    return "Tonga (Tonga Islands)";
                case "tr":
                    return "Turkish";
                case "ts":
                    return "Tsonga";
                case "tt":
                    return "Tatar";
                case "tw":
                    return "Twi";
                case "ty":
                    return "Tahitian";
                case "ug":
                    return "Uighur";
                case "uk":
                    return "Ukrainian";
                case "ur":
                    return "Urdu";
                case "uz":
                    return "Uzbek";
                case "ve":
                    return "Venda";
                case "vi":
                    return "Vietnamese";
                case "vo":
                    return "Volapuk";
                case "wa":
                    return "Walloon";
                case "wo":
                    return "Wolof";
                case "xh":
                    return "Xhosa";
                case "yi":
                    return "Yiddish";
                case "yo":
                    return "Yoruba";
                case "za":
                    return "Zhuang";
                case "zh":
                    return "Chinese";
                case "zh":
                    return "Chinese";
                case "zu":
                    return "Zulu";
            }

            return lang;
        };
    })
    .filter('bb_address', function($filter) {
        //Format Blue Button address JSON struct into string

        return function(address) {
            if (typeof address === "undefined") {
                return "";
            }

            var displayAddress = [];

            if (address.streetLines && address.streetLines.length > 0) {
                for (var addrLine in address.streetLines) {
                    displayAddress.push(address.streetLines[addrLine]);
                }
            }
            var cityLine = "";
            var cityTest = "";
            if (address.city) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.city + "," : cityLine = address.city + ",";
            }
            if (address.state) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.state : cityLine = address.state;
            }
            if (address.zip) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.zip : cityLine = address.zip;
            }
            if (cityLine.length > 0) {
                displayAddress.push(cityLine);
            }

            return displayAddress.join(", ");
        };
    })
    .filter('capFirstLetters', function($filter) {
        //capitalize first letter of every word
        return function(input) {
            if (input != null) {
                var inputArr = input.split(' ');
                var newString = "";
                for (var x in inputArr) {
                    var token = inputArr[x];
                    newString += token.substring(0, 1).toUpperCase() + token.substring(1) + " ";
                }
                newString.trim();
                return newString;
            }
        };
    })


.config(['$routeProvider', '$locationProvider', '$compileProvider',
    function($routeProvider, $locationProvider, $compileProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/dashboard/dashboard.tpl.html',
            controller: 'dashboardCtrl'
        });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);

    }
])

.factory('myHttpResponseInterceptor', ['$q', '$location',
    function($q, $location) {
        console.log("HTTP intercepting...");

        return {

            response: function(response) {
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    $location.path('/home');
                }
                return $q.reject(rejection);
            }
        };

    }
])

//Http Intercpetor to check auth failures for xhr requests
.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.interceptors.push('myHttpResponseInterceptor');
    }
])

// Note TabService is included but not used to ensure its been instantiated
.run(['$rootScope', '$location',
    function($rootScope, $location) {

    }
]);

// For notification updates, tie to rootScope
dre.controller('MainCtrl', ['$http','$location','$rootScope', '$scope', 'getNotifications', 'account',
    function($http, $location, $rootScope, $scope, getNotifications, account) {
        $scope.navPath = "templates/nav/nav.tpl.html";

        $rootScope.isAuthenticated = false;
        account.isAuthenticated(function(err, result) {
            $rootScope.isAuthenticated = result;
            //$scope.isAuthenticated=$rootScope.isAuthenticated;
        });

        $rootScope.notifications = {};
        getNotifications.getUpdate(function(err, notifications) {
            $rootScope.notifications = notifications;
        });


        $scope.logout = function() {
            $http.post('api/v1/logout')
                .success(function() {
                    $rootScope.isAuthenticated=false;
                    $location.path('/home');
                }).error(function() {
                    callback();
                });
        };

    }


]);

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

angular.module('dre.dashboard', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'templates/dashboard/dashboard.tpl.html',
      controller: 'dashboardCtrl'
    });
  }
])

.controller('dashboardCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {


  }
]);
angular.module('dre.home', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'templates/home/home.tpl.html',
            controller: 'homeCtrl'
        });
    }
])

.controller('homeCtrl', ['$rootScope', '$scope', '$http', '$location', 'getNotifications',
    function($rootScope, $scope, $http, $location, getNotifications) {
        $scope.inputUsername = '';
        $scope.inputPassword = '';

        $scope.submitInput = function() {
            $http.post('api/v1/login', {
                username: $scope.inputUsername,
                password: $scope.inputPassword
            })
                .success(function(data) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.notifications = {};
                    getNotifications.getUpdate(function(err, notifications) {
                        $rootScope.notifications = notifications;
                    });
                    $location.path('/dashboard');
                }).error(function(data) {
                    callback(data);
                });
        };
    }
]);

angular.module('dre.login', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'templates/login/login.tpl.html',
      controller: 'loginCtrl'
    });
  }
])

.controller('loginCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {   
    $scope.inputUsername = '';
    $scope.inputPassword = '';

    $scope.submitInput = function() {
      $http.post('api/v1/login', {username: $scope.inputUsername, password: $scope.inputPassword})
        .success(function (data) {
          $location.path('/dashboard');
        }).error(function (data) {
          callback(data);
        });
    };
  }
]);
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

angular.module('dre.match', ['dre.match.reconciliation'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/match', {
      templateUrl: 'templates/matching/matching.tpl.html',
      controller: 'matchCtrl'
    });
  }
])

.controller('matchCtrl', ['$scope', '$http', '$location','recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.new_merges = [];
    $scope.duplicate_merges = [];
    $scope.predicate = "-merged";
    $scope.displayMerges = false;

    $scope.updateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "entry_type") {
          $scope.predicate = "entry_type";
        } else {
          $scope.predicate = "-entry_type";
        }
      } else {
        $scope.predicate = "-entry_type";
      }
    };

    $scope.elementSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "entry.name") {
          $scope.predicate = "entry.name";
        } else {
          $scope.predicate = "-entry.name";
        }
      } else {
        $scope.predicate = "-entry.name";
      }
    };

    $scope.dateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "merged") {
          $scope.predicate = "merged";
        } else {
          $scope.predicate = "-merged";
        }
      } else {
        $scope.predicate = "-merged";
      }
    };

    $scope.getUnresolvedUpdates = function() {

      //Will need to flag source record data.
      var placeholderJSON = {
        //2 Allergies are awaiting your review.

      };


    };

    function formatMerges (inputMerge) {
      var trimLength = 35;
      for (var iMerge in inputMerge) {
          if (inputMerge[iMerge].entry_type !== 'demographics') {
            recordFunctions.extractName(inputMerge[iMerge].entry, inputMerge[iMerge].entry_type);
          }

          if (inputMerge[iMerge].entry_type === 'demographics') {
            var tmpName = recordFunctions.formatName(inputMerge[iMerge].entry.name);
            inputMerge[iMerge].entry.name = tmpName.displayName;
          }
      }
    }



    //This is going away.
    $scope.reconciliationClick = function() {
      $location.path("match/reconciliation");
    };

    $http({
      method: 'GET',
      url: '/api/v1/merges'
    }).
    success(function(data, status, headers, config) {
      if (data.merges.length > 0) {
        console.log('data merges on success');
        console.log(data.merges);
        $scope.displayMerges = true;
      } else {
        $scope.displayMerges = false;
      }


      for (var i = 0; i < data.merges.length; i++) {
        data.merges[i].section_singular = recordFunctions.singularizeSection(data.merges[i].entry_type);
        if (data.merges[i].merge_reason === "duplicate") {
          $scope.duplicate_merges.push(data.merges[i]);
        } else {
          $scope.new_merges.push(data.merges[i]);
        }
      }

      formatMerges($scope.new_merges);

    }).
    error(function(data, status, headers, config) {
      //console.log('error');
    });


  }
]);

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

angular.module('dre.match.reconciliation', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation', {
            templateUrl: 'templates/matching/reconciliation/reconciliation.tpl.html',
            controller: 'reconciliationCtrl'
        });
    }
])

.controller('reconciliationCtrl', ['$scope', '$http', '$location', '$rootScope', 'recordFunctions',
    function($scope, $http, $location, $rootScope, recordFunctions) {

        $scope.reviewClick = function(match) {
            //alert(JSON.stringify(match));
            console.log("Review Match Click!");
            console.log(JSON.stringify(match,null,4));

            //pass section name and _id of the match object only
            $location.path("match/reconciliation/review/" + match.entry_type + "/" + match._id);
        };

        $scope.matches = {};

        $scope.capitalize = function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        };

        $scope.getMatches = function() {
            var sections = ['allergies', 'procedures', 'immunizations', 'medications', 'encounters', 'vitals', 'results', 'social_history', 'demographics', 'problems', 'claims', 'payers'];
            //var sections = ['allergies'];

            function getMatchSections(loadsec) {
                //console.log(loadsec);
                $http({
                    method: 'GET',
                    url: '/api/v1/matches/' + loadsec
                }).
                success(function(data, status, headers, config) {
                    //console.log(data.matches);

                    for (var iM in data.matches) {

                        console.log(data.matches[iM]);
                        data.matches[iM].entry = recordFunctions.extractName(data.matches[iM].entry, loadsec);
                        data.matches[iM].singular_section = recordFunctions.singularizeSection(data.matches[iM].entry_type);

                    }

                    $scope.matches[loadsec] = data.matches;
                    //console.log(JSON.stringify($scope.masterMatch, null, 10));
                }).
                error(function(data, status, headers, config) {
                    console.log('error');
                });
            }

            for (var i in sections) {
                getMatchSections(sections[i]);
            }
        };

        $scope.getMatches();



    }
]);

angular.module('dre.match.review_new', ['directives.matchingObjects'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/match/reconciliation/review/:section/:match_id', {
            templateUrl: 'templates/matching/reconciliation/review/review.tpl.html',
            controller: 'matchReviewCtrl'
        });
    }
])

.controller('matchReviewCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', 'getNotifications', 'recordFunctions',
    function($rootScope, $scope, $http, $routeParams, $location, getNotifications, recordFunctions) {

        $scope.titles = {
            allergies: "Allergies",
            encounters: "Encounters",
            immunizations: "Immunizations",
            medications: "Medications",
            problems: "Problem List",
            procedures: "Procedures",
            vitals: "Vital Signs",
            payers: "Insurance",
            claims: "Claims",
            results: "Results",
            social_history: "Social History"
        };

        //resetting page and all the data to original state
        $scope.reset = function() {
            $scope.match = {};
            $scope.new_entry = {};
            $scope.current_entry = {};
            $scope.update_entry = {};
            $scope.selectedItems = {};
            $scope.changed = false;

            if ($scope.section === 'allergies') {
                $scope.selectedItems.observation = {};
                $scope.selectedItems.observation.reactions = [];
            } else if ($scope.section === 'encounters') {
                $scope.selectedItems.findings = [];

            } else if ($scope.section === 'results') {
                $scope.selectedItems.results = {};
                $scope.selectedItems.results.src_id = [];
                $scope.selectedItems.results.dest_id = [];
                $scope.selectedItems.results.key = [];
            }

            max_src = 0;
            max_dest = 0;

            $scope.getMatch();
        };


        //getting parameters from route/url
        $scope.section = $routeParams["section"];
        $scope.match_id = $routeParams["match_id"];

        //shim for switching on new UI
        $scope.version = "old";
        if (["demographics", "-allergies", "insurance", "vitals", "encounters", "immunizations", "problems", "procedures", "results", "-social_history"].indexOf($scope.section.toString()) >= 0) {
            $scope.version = "new";
        }
        $scope.version = "new";


        //fetching match object based on id
        $scope.match = {};
        $scope.new_entry = {};
        $scope.current_entry = {};
        $scope.update_entry = {};
        $scope.selectedItems = {};
        $scope.changed = false;

        //function evaluates selectedItems object, and updates flag if any changes to MHR were made
        function isChanged() {
            for (var el in $scope.selectedItems) {
                if ($scope.selectedItems[el]) {
                    $scope.changed = true;
                    return;
                }
            }
            $scope.changed = false;
            return;
        }

        if ($scope.section === 'allergies') {
            $scope.selectedItems.observation = {};
            $scope.selectedItems.observation.reactions = [];
        } else if ($scope.section === 'encounters') {
            $scope.selectedItems.findings = [];

        } else if ($scope.section === 'results') {
            $scope.selectedItems.results = {};
            $scope.selectedItems.results.src_id = [];
            $scope.selectedItems.results.dest_id = [];
            $scope.selectedItems.results.key = [];
        }

        var max_src = 0;
        var max_dest = 0;

        $scope.rotateMatch = function(new_dest_index) {
            setMatchEntry(new_dest_index);
        };

        function setMatchEntry(match_index) {

            $scope.current_match_index = match_index;
            $scope.current_entry = $scope.match.matches[$scope.current_match_index].match_entry;
            $scope.update_entry = angular.copy($scope.current_entry);
            $scope.current_match = $scope.match.matches[$scope.current_match_index].match_object;
            $scope.current_queue = $scope.match.matches.slice($scope.current_match_index + 1);
            $scope.match_diff = angular.copy($scope.current_match.diff);
            $scope.match_percent = $scope.current_match.percent;

            //Restructure diff object booleans.

            for (var diff in $scope.match_diff) {

                if ($scope.match_diff[diff] === "duplicate") {
                    $scope.match_diff[diff] = true;
                } else {
                    $scope.match_diff[diff] = false;
                }

            }

            //Build out empty match diff objects as false.
            for (var diffEntry in $scope.current_entry) {
                if ($scope.new_entry[diffEntry] === undefined) {
                    $scope.match_diff[diffEntry] = true;
                }
            }

            var tempArrayDiff;

            if ($scope.section === 'allergies') {

                var my_match_diff = {};

                //Extend Diff Object to include subarray.
                my_match_diff.observation = {};
                my_match_diff.observation.reactions = {};
                my_match_diff.observation.reactions.src = [];
                my_match_diff.observation.reactions.dest = [];

                for (var src_i in $scope.new_entry.observation.reactions) {
                    my_match_diff.observation.reactions.src.push(false);
                    $scope.selectedItems.observation.reactions.push(false);
                }

                for (var dest_i in $scope.current_entry.observation.reactions) {
                    my_match_diff.observation.reactions.dest.push(false);
                }
                tempArrayDiff = $scope.current_match.subelements.observation.reactions;
                for (var i in tempArrayDiff) {
                    if (tempArrayDiff[i].match === "duplicate") {
                        my_match_diff.observation.reactions.src[tempArrayDiff[i].src_id] = true;
                        my_match_diff.observation.reactions.dest[tempArrayDiff[i].dest_id] = true;
                    }
                }

                //Allergies shim based on object brevity.
                for (var temp_current_diff in $scope.current_entry.observation) {
                    if ($scope.new_entry.observation[temp_current_diff] === undefined) {
                        if (temp_current_diff !== "reactions") {
                            my_match_diff.observation[temp_current_diff] = true;
                        }

                    } else {
                        if (angular.equals($scope.new_entry.observation[temp_current_diff], $scope.current_entry.observation[temp_current_diff])) {
                            if (temp_current_diff !== "reactions") {
                                my_match_diff.observation[temp_current_diff] = true;
                            }

                        }

                    }


                }

                $scope.match_diff = angular.copy(my_match_diff);
            }

            if ($scope.section === 'encounters') {
                $scope.match_diff.findings = {};
                $scope.match_diff.findings.src = [];
                $scope.match_diff.findings.dest = [];

                for (var src_ei in $scope.new_entry.findings) {
                    $scope.match_diff.findings.src.push(false);
                    $scope.selectedItems.findings.push(false);
                }

                for (var dest_ei in $scope.current_entry.findings) {
                    $scope.match_diff.findings.dest.push(false);
                }
                tempArrayDiff = $scope.current_match.subelements.findings;

                for (var ei in tempArrayDiff) {
                    if (tempArrayDiff[ei].match === "duplicate") {
                        $scope.match_diff.findings.src[tempArrayDiff[ei].src_id] = true;
                        $scope.match_diff.findings.dest[tempArrayDiff[ei].dest_id] = true;
                    }
                }
            }

            if ($scope.section === 'results') {
                $scope.match_diff.results = {};
                $scope.match_diff.results.src = [];
                $scope.match_diff.results.dest = [];

                for (var src_ri in $scope.new_entry.results) {
                    $scope.match_diff.results.src.push(false);
                    $scope.selectedItems.results.src_id.push(false);
                }

                for (var dest_ri in $scope.current_entry.results) {
                    $scope.match_diff.results.dest.push(false);
                    $scope.selectedItems.results.dest_id.push(false);
                    $scope.selectedItems.results.key.push(null);
                }
                tempArrayDiff = $scope.current_match.subelements.results;

                for (var ri in tempArrayDiff) {
                    if (tempArrayDiff[ri].match === "duplicate") {
                        $scope.match_diff.findings.src[tempArrayDiff[ri].src_id] = true;
                        $scope.match_diff.findings.dest[tempArrayDiff[ri].dest_id] = true;
                    }
                }
            }

        }

        $scope.getMatch = function() {
            $http({
                method: 'GET',
                url: '/api/v1/match/' + $scope.section + '/' + $scope.match_id
            }).
            success(function(data, status, headers, config) {
                $scope.match = data;
                $scope.new_entry = $scope.match.entry;
                setMatchEntry(0);

            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.getMatch();

        $scope.discardMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id,
                data: {
                    determination: 'ignored'
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.createMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id,
                data: {
                    determination: 'added'
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.
                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.saveMatch = function() {
            $http({
                method: 'POST',
                url: '/api/v1/matches/' + $scope.section + '/' + $scope.match_id + '/' + $scope.current_match_index,
                data: {
                    determination: 'merged',
                    updated_entry: $scope.update_entry
                }
            }).
            success(function(data, status, headers, config) {
                //Note:  Pill count not refreshing.


                getNotifications.getUpdate(function(err, notifications) {
                    $rootScope.notifications = notifications;
                });

                $location.path("match/reconciliation");
            }).
            error(function(data, status, headers, config) {
                console.log('error');
            });
        };

        $scope.v2TemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_v2.tpl.html";

        $scope.newTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_new.tpl.html";
        $scope.recordTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_record.tpl.html";
        $scope.subTemplatePath = "templates/matching/reconciliation/review/templates/" + $scope.section + "_sub.tpl.html";


        // for subelements (results)
        $scope.removeField_subel = function(entry, entry_index, entry_status) {

            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            var splitEntry = [];

            if (!$scope.selectedItems.results.src_id[$scope.selectedItems.results.key[entry_index]]) {
                $scope.selectedItems.results.dest_id.splice(entry_index, 1);
                $scope.selectedItems.results.key.splice(entry_index, 1);
                $scope.update_entry[entry].splice(entry_index, 1);
                $scope.match_diff[entry].dest.splice(entry_index, 1);
            } else {
                $scope.selectedItems.results.src_id[$scope.selectedItems.results.key[entry_index]] = false;
                $scope.selectedItems.results.dest_id.splice(entry_index, 1);
                $scope.selectedItems.results.key.splice(entry_index, 1);
                $scope.update_entry[entry].splice(entry_index, 1);
                $scope.match_diff[entry].dest.splice(entry_index, 1);
            }
            //recalculate changed status
            isChanged();

        };

        // for subelements (results)
        $scope.selectField_subel = function(entry, entry_index, entry_status) {
            console.log("select field", entry, entry_status);
            if ($scope.selectedItems[entry] === true) {
                console.log("cancel");
                return;
            }
            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            var splitEntry = [];

            if (!$scope.selectedItems.results.src_id[entry_index]) {
                $scope.selectedItems.results.src_id[entry_index] = true;
                $scope.selectedItems.results.dest_id.splice(entry_index, 0, true);
                $scope.selectedItems.results.key.splice(entry_index, 0, entry_index);
                $scope.update_entry[entry].splice(entry_index, 0, $scope.new_entry[entry][entry_index]);
                //Need to inject because adding a record
                $scope.match_diff[entry].dest.splice(entry_index, 0, false);
                //$scope.match_diff[entry].dest[entry_index] = false;
            } else {
                $scope.selectedItems.results.src_id[entry_index] = false;
                $scope.update_entry[entry].splice(entry_index, 1);
                $scope.match_diff[entry].dest.splice(entry_index, 1);
            }

            //recalculate changed status
            isChanged();

        };
        // end subelements functions


        $scope.removeField = function(entry, entry_index, entry_status) {


            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            var splitEntry = [];


            //Only array objects should get indexes.
            if (entry_index >= 0 && entry_index !== null) {

                //Handles dot nesting.
                if (entry.indexOf(".") > -1) {
                    splitEntry = entry.split(".");
                    if (splitEntry.length === 2) {
                        if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index]) {
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                        } else {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = false;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                        }

                    }
                    //Handles subarrays.
                } else {
                    if (!$scope.selectedItems[entry][entry_index]) {
                        $scope.update_entry[entry].splice(entry_index, 1);
                        $scope.match_diff[entry].dest.splice(entry_index, 1);
                    } else {
                        $scope.selectedItems[entry][entry_index] = false;
                        $scope.update_entry[entry].splice(entry_index, 1);
                        $scope.match_diff[entry].dest.splice(entry_index, 1);
                    }
                }
                //Handles regular.
            } else {

                if (entry.indexOf(".") > -1) {
                    splitEntry = entry.split(".");
                    if (splitEntry.length === 2) {
                        if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]]) {
                            //console.log($scope.new_entry);
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]] = true;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.new_entry[splitEntry[0]][splitEntry[1]];
                        } else {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]] = false;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.current_entry[splitEntry[0]][splitEntry[1]];
                        }
                    }
                    //Handles subarrays.
                } else {
                    if (!$scope.selectedItems[entry]) {
                        console.log($scope.new_entry);
                        $scope.selectedItems[entry] = true;
                        $scope.update_entry[entry] = $scope.new_entry[entry];
                    } else {
                        $scope.selectedItems[entry] = false;
                        $scope.update_entry[entry] = $scope.current_entry[entry];
                    }
                }

            }

            //recalculate changed status
            isChanged();

        };





        $scope.selectField = function(entry, entry_index, entry_status) {
            console.log("select field", entry, entry_status);
            if ($scope.selectedItems[entry] === true) {
                console.log("cancel");
                return;
            }
            //Don't process hidden items.
            if (entry_status) {
                return;
            }

            var splitEntry = [];

            if (entry_index >= 0 && entry_index !== null) {

                //Handles dot nesting.
                if (entry.indexOf(".") > -1) {
                    splitEntry = entry.split(".");
                    if (splitEntry.length === 2) {
                        if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index]) {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = true;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 0, $scope.new_entry[splitEntry[0]][splitEntry[1]][entry_index]);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, false);
                        } else {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]][entry_index] = false;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]].splice(entry_index, 1);
                            //$scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 0, true);
                            $scope.match_diff[splitEntry[0]][splitEntry[1]].dest.splice(entry_index, 1);
                        }

                    }
                    //Handles subarrays.
                } else {
                    if (!$scope.selectedItems[entry][entry_index]) {
                        $scope.selectedItems[entry][entry_index] = true;
                        $scope.update_entry[entry].splice(entry_index, 0, $scope.new_entry[entry][entry_index]);
                        //Need to inject because adding a record
                        $scope.match_diff[entry].dest.splice(entry_index, 0, false);
                        //$scope.match_diff[entry].dest[entry_index] = false;
                    } else {
                        $scope.selectedItems[entry][entry_index] = false;
                        $scope.update_entry[entry].splice(entry_index, 1);
                        $scope.match_diff[entry].dest.splice(entry_index, 1);
                    }
                }
                //Handles regular.
            } else {

                if (entry.indexOf(".") > -1) {
                    splitEntry = entry.split(".");
                    if (splitEntry.length === 2) {
                        if (!$scope.selectedItems[splitEntry[0]][splitEntry[1]]) {
                            //console.log($scope.new_entry);
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]] = true;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.new_entry[splitEntry[0]][splitEntry[1]];
                        } else {
                            $scope.selectedItems[splitEntry[0]][splitEntry[1]] = false;
                            $scope.update_entry[splitEntry[0]][splitEntry[1]] = $scope.current_entry[splitEntry[0]][splitEntry[1]];
                        }
                    }
                    //Handles subarrays.
                } else {
                    if (!$scope.selectedItems[entry]) {
                        console.log($scope.new_entry);
                        $scope.selectedItems[entry] = true;
                        $scope.update_entry[entry] = $scope.new_entry[entry];
                    } else {
                        $scope.selectedItems[entry] = false;
                        $scope.update_entry[entry] = $scope.current_entry[entry];
                    }
                }

            }

            //recalculate changed status
            isChanged();

        };

    }
]);

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

angular.module('dre.nav', [])

.controller('navCtrl', ['$rootScope','$scope', '$http', '$location',
	function($rootScope, $scope, $http, $location) {

		$scope.logout = function() {
			$http.post('/api/v1/logout')
			.success(function (data) {
				$rootScope.isAuthenticated=false;
				$location.path('/home');
			}).error(function (data) {
				callback(data);
			});
		};
	}
]);
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

angular.module('dre.record.allergies', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/allergies', {
      templateUrl: 'templates/record/components/allergies.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('allergiesCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "allergies");

  }
]);
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

angular.module('dre.record.claims', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/claims', {
      templateUrl: 'templates/record/components/claims.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('claimsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
  function($scope, $http, $location, recordFunctions) {

    $scope.claims = [];
    $scope.displayClaims = false;
    $scope.claimsPredicate = "-date_weight";


    $scope.getRecord = function() {
      $http({
        method: 'GET',
        url: '/api/v1/record/claims'
      }).
      success(function(data, status, headers, config) {
        $scope.claims = data.claims;
        if ($scope.claims.length > 0) {
          $scope.displayClaims = true;
          $scope.updateFields();
        } else {
          $scope.displayClaims= false;
        }
      }).
      error(function(data, status, headers, config) {
        console.log('error');
      });
    };

    $scope.updateFields = function() {

        //this variable is used to prevent id colllisions in claims HTML.
        var claimCount = 0;


      for (var i in $scope.claims) {
        recordFunctions.extractName($scope.claims[i], "claims");
        var claim = $scope.claims[i];
        //id for claims, since all claims may not have claim.number
        claim.count = i;

        if(claim.name === "unknown"){
            claim.name = undefined;
        }

        /*if(claim.start_date){
            //format date for Details section
            console.log(claim);
            recordFunctions.formatDateTime(claim.date_time);
            //prepare the date that is going to be displayed in accordion
            claim.titleDate = claim.date_time;
        }
        if(claim.end_date){
            recordFunctions(formatDate(claim.end_date));
            claim.titleDate = claim.end_date;
        }
        if(claim.service_date){
            recordFunctions(formatDate(claim.service_date));
            if(claim.titleDate === undefined){
                claim.titleDate = claim.service_date;
            }

        }
        //assign date weight if titleDate was defined from above
        if(claim.titleDate){
            claim.date_weight = claim.titleDate.date;
        }
        //just assign UTC 1970 to claim date weight so it's at the bottom of the section
        else{
            claim.date_weight = (new Date(0)).toISOString();
        }*/


        if (claim.date_time) {
          recordFunctions.formatDateTime(claim.date_time);
        }

        for(var x in claim.lines){
            var line = claim.lines[x];
            if(line.date_time){
                recordFunctions.formatDateTime(line.date_time);
            }
        }

        if (claim.performer) {
          for (var y in claim.performer) {
            for (var z in claim.performer[y].address) {
              recordFunctions.formatAddress(claim.performer[y].address[z]);
            }      
          }
        }


        /*
        if ($scope.immunizations[i].performer.address) {
              for (var perAddr in $scope.immunizations[i].performer.address) {
                recordFunctions.formatAddress($scope.immunizations[i].performer.address[perAddr]);
              }
          }
        */

      }
    };

    $scope.getStub = function() {
      $scope.displayclaims = true;
      $scope.claims = [{}];
      $scope.updateFields();
    };

    $scope.getRecord();
    //$scope.getStub();

  }
]);
/* Scrap from tests


claim.provider = {};
claim.provider.name = 'ostrich';
claim.provider.identifiers = [];
var sampleIdentifier = {'identifier': '12345' ,'identifier_type': 'cms'};
var sampleIdentifier2 = {'identifier': '12345' ,'identifier_type': 'cms'};
claim.provider.identifiers.push(sampleIdentifier);
claim.provider.identifiers.push(sampleIdentifier2);

*/


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

angular.module('dre.record.encounters', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/encounters', {
      templateUrl: 'templates/record/components/encounters.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('encountersCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "encounters");
  }
]);
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

angular.module('dre.record.immunizations', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/immunizations', {
      templateUrl: 'templates/record/components/immunizations.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('immunizationsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "immunizations");

  }
]);

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

angular.module('dre.record.medications', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/record/medications', {
      templateUrl: 'templates/record/components/medications.tpl.html',
      controller: 'recordsCtrl'
    });
  }
])

.controller('medicationsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "medications");

  }
]);
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

angular.module('dre.record.plan_of_care', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/plan_of_care', {
            templateUrl: 'templates/record/components/plan_of_care.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('planCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "plan_of_care");

    }
]);

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

angular.module('dre.record.problems', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/problems', {
            templateUrl: 'templates/record/components/problems.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('problemsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "problems");
    }
]);

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

angular.module('dre.record.procedures', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/procedures', {
            templateUrl: 'templates/record/components/procedures.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('proceduresCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "procedures");

    }
]);

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

angular.module('dre.record.results', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/results', {
            templateUrl: 'templates/record/components/results.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('resultsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "results");

    }
]);

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

angular.module('dre.record.social_history', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/social_history', {
            templateUrl: 'templates/record/components/social_history.tpl.html',
            controller: 'social_historyCtrl'
        });
    }
])

.controller('social_historyCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "social_history");

    }
]);

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

angular.module('dre.record.vitals', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/record/vitals', {
            templateUrl: 'templates/record/components/vitals.tpl.html',
            controller: 'recordsCtrl'
        });
    }
])

.controller('vitalsCtrl', ['$scope', '$http', '$location', 'recordFunctions',
    function($scope, $http, $location, recordFunctions) {

        $scope.entries = [];
        $scope.display = false;

        recordFunctions.getEntries($scope, "vitals");

    }
]);

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

angular.module('dre.demographics', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/profile', {
      templateUrl: 'templates/record/demographics.tpl.html',
      controller: 'demographicsCtrl'
    });
  }
])

.controller('demographicsCtrl', ['$scope', '$http', '$q', '$location', 'recordFunctions',
  function($scope, $http, $q, $location, recordFunctions) {

    $scope.demographics = [];
    $scope.displayDemographics = false;
    $scope.demographicsPredicate = "-severity_weight";

    $scope.getRecord = function() {
      $q.all([
        $http({
          method: 'GET',
          url: '/api/v1/record/demographics'
        })]).then(function(response) {
        var data = response[0].data;
        $scope.demographics = data.demographics[0];
        if (data.demographics.length > 0) {
          $scope.displayDemographics = true;
        } else {
          $scope.displayDemographics = false;
        }

      }, function(response) {
        console.log('error');
      });
    };

    $scope.getStub = function() {
      $scope.displayDemographics = true;
      $scope.demographics = {
        "name": {
          "middle": [
            "Isa"
          ],
          "last": "Jones",
          "first": "Isabella"
        },
        "dob": [{
          "date": "1975-05-01T00:00:00.000Z",
          "precision": "day"
        }],
        "gender": "Female",
        "identifiers": [{
          "identifier": "2.16.840.1.113883.19.5.99999.2",
          "identifier_type": "998991"
        }, {
          "identifier": "2.16.840.1.113883.4.1",
          "identifier_type": "111-00-2330"
        }],
        "marital_status": "Married",
        "addresses": [{
          "streetLines": [
            "1357 Amber Drive"
          ],
          "city": "Beaverton",
          "state": "OR",
          "zip": "97867",
          "country": "US",
          "use": "primary home"
        }],
        "phone": [{
          "number": "(816)276-6909",
          "type": "primary home"
        }],
        "race_ethnicity": "White",
        "languages": [{
          "language": "en",
          "preferred": true,
          "mode": "Expressed spoken",
          "proficiency": "Good"
        }],
        "religion": "Christian (non-Catholic, non-specific)",
        "birthplace": {
          "city": "Beaverton",
          "state": "OR",
          "zip": "97867",
          "country": "US"
        },
        "guardians": [{
          "relation": "Parent",
          "addresses": [{
            "streetLines": [
              "1357 Amber Drive"
            ],
            "city": "Beaverton",
            "state": "OR",
            "zip": "97867",
            "country": "US",
            "use": "primary home"
          }],
          "names": [{
            "last": "Jones",
            "first": "Ralph"
          }],
          "phone": [{
            "number": "(816)276-6909",
            "type": "primary home"
          }]
        }]
      };

    };

    $scope.getRecord();
    //$scope.getStub();


  }
]);
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
=====================================`=================================*/

var supportedComponents = ['demographics', 'allergies', 'encounters', 'immunizations', 'medications', 'problems', 'procedures', 'results', 'social_history', 'vitals', 'claims', 'insurance'];

angular.module('dre.record', ['dre.record.allergies', 'dre.record.medications', 'dre.record.encounters', 'dre.record.procedures', 'dre.record.immunizations', 'dre.record.problems', 'dre.record.results', 'dre.record.vitals', 'dre.record.insurance', 'dre.record.claims', 'dre.record.social_history', 'dre.record.plan_of_care'])
.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.when('/record', {
      templateUrl: 'templates/record/record.tpl.html',
      controller: 'recordCtrl'
  });
}])

  .controller('recordCtrl', ['$scope', '$filter', '$http', '$q', '$location', 'fileDownload', 
    function($scope, $filter, $http, $q, $location, fileDownload) {

      $scope.medicationsPath = "templates/record/components/medications.tpl.html";
      $scope.allergiesPath = "templates/record/components/allergies.tpl.html";
      $scope.encountersPath = "templates/record/components/encounters.tpl.html";
      $scope.proceduresPath = "templates/record/components/procedures.tpl.html";
      $scope.immunizationsPath = "templates/record/components/immunizations.tpl.html";
      $scope.problemsPath = "templates/record/components/problems.tpl.html";
      $scope.resultsPath = "templates/record/components/results.tpl.html";
      $scope.vitalsPath = "templates/record/components/vitals.tpl.html";
      $scope.insurancePath  = "templates/record/components/insurance.tpl.html";
      $scope.claimsPath = "templates/record/components/claims.tpl.html";
      $scope.social_historyPath = "templates/record/components/social_history.tpl.html";
      //$scope.planPath = "templates/record/components/plan_of_care.tpl.html";

      $scope.dismissModal = function(index) {
        $("#myModal" + index).on("hidden.bs.modal", function (e) {
            $location.path("/storage");
            $scope.$apply();
        });
      };

    }
  ]);

angular.module('dre.register', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'templates/register/register.tpl.html',
            controller: 'registerCtrl'
        });
    }
])

.controller('registerCtrl', ['$rootScope', '$scope', '$http', '$location', 'getNotifications',
    function($rootScope, $scope, $http, $location, getNotifications) {

        $scope.inputUsername = '';
        $scope.inputPassword = '';
        $scope.inputEmail = '';
        $scope.regError = '';

        $scope.submitReg = function() {
            $http.post('/api/v1/register', {
                "username": $scope.inputUsername,
                "password": $scope.inputPassword,
                "email": $scope.inputEmail
            })
                .success(function(data) {
                    $scope.submitLogin();
                    $location.path('/dashboard');
                }).error(function(data) {
                    $scope.regError = data;
                });
        };

        $scope.submitLogin = function() {
            $http.post('api/v1/login', {
                "username": $scope.inputUsername,
                "password": $scope.inputPassword
            })
                .success(function(data) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.notifications = {};
                    getNotifications.getUpdate(function(err, notifications) {
                        $rootScope.notifications = notifications;
                    });

                    $location.path('/dashboard');
                }).error(function(data) {
                    $rootScope.isAuthenticated = false;
                    $location.path('/home');
                });
        };
    }
]);

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

angular.module('dre.storage', ['directives.fileModel'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/storage', {
      templateUrl: 'templates/storage/storage.tpl.html',
      controller: 'storageCtrl'
    });
  }
])

.controller('storageCtrl', ['$rootScope', '$scope', '$route', '$http', '$location', 'fileUpload', 'getNotifications',
  function($rootScope, $scope, $route, $http, $location, fileUpload, getNotifications) {

    $scope.predicate = "-file_upload_date";

    $scope.nameSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "file_name") {
          $scope.predicate = "file_name";
        } else {
          $scope.predicate = "-file_name";
        }
      } else {
        $scope.predicate = "-file_name";
      }
    };

    $scope.dateSort = function () {
      if ($scope.predicate.substring(0,1) === "-") {
        if ($scope.predicate.substring(1) === "file_upload_date") {
          $scope.predicate = "file_upload_date";
        } else {
          $scope.predicate = "-file_upload_date";
        }
      } else {
        $scope.predicate = "-file_upload_date";
      }
    };

    $scope.file_array = [];
    $scope.displayRecords = false;

    $scope.refreshRecords = function() {
      $http({
        method: 'GET',
        url: '/api/v1/storage'
      }).
      success(function(data, status, headers, config) {
        $scope.file_array = data.storage;
        getNotifications.getUpdate(function(err, notifications) {
          $rootScope.notifications = notifications;
        });
        if ($scope.file_array.length > 0) {
          $scope.displayRecords = true;
        } else {
          $scope.displayRecords = false;
        }
      }).
      error(function(data, status, headers, config) {
      });
    };

    $scope.refreshRecords();

    //File upload.
    $scope.uploadRecord = function() {

      var uploadFile = $scope.myFile;
      var uploadUrl = "/api/v1/storage";
      fileUpload.uploadFileToUrl(uploadFile, uploadUrl, function(err, res) {
        if (err) {
          console.log(err);
        }

        angular.element("div").removeClass("modal-backdrop fade in");
        $scope.myFile = null;
        $scope.refreshRecords();
        //$route.reload();
      });

    };

  }
]);

angular.module('directives.fileModel', [])

.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
angular.module('directives.matchingObjects', [])

.directive('singleEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-12'>{{inputValue}}</td><!--td class='col-md-4 text-left'></td--></tr>",
            link: function(scope, element, attrs) {}
        };
    }
])
.directive('singlesmallEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><b>{{inputTitle}}</b></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-12'>{{inputValue}}</td><!--td class='col-md-4 text-left'></td--></tr>",
            link: function(scope, element, attrs) {}
        };
    }
])
.directive('multisingleEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ng-repeat='item in inputValue'><td class='col-md-12'>{{item}}</td><!--td class='col-md-4 text-left'></td--></tr>"+
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('physicalquantityEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-12'>{{inputValue.value}}&nbsp;{{inputValue.unit}}</td></tr></table>",
            link: function(scope, element, attrs) {}
        };
    }
])
.directive('phoneEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ng-repeat='phone in inputValue'><td class='col-md-8'>{{phone.number}}</td><td class='col-md-4 text-left'>{{phone.type}}</td></tr>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('emailEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></div></th></tr></thead>" +
                "<tr ng-repeat='email in inputValue'><td class='col-md-12'>{{email.address}}</td></tr>",
            link: function(scope, element, attrs) {}
        };
    }
])
.directive('nameEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-12'>{{inputValue.first}} {{inputValue.middle.join(' ')}} {{inputValue.last}}</td></tr>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('addressEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ng-repeat='line in inputValue.street_lines'><td class='col-md-12'>{{line}}</td></tr>" +
                "<tr><td class='col-md-12'>{{inputValue.city}}, {{inputValue.state}} {{inputValue.zip}}</td></tr>"+
                "<tr ng-show='inputValue.country'><td class='col-md-12'>{{inputValue.country}}</td></tr></table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('addressesEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<table class='table table-condensed' ng-repeat='address in inputValue'>" +
                "<thead><tr><th><h4>Address</h4></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ng-show='address.use'><td class='col-md-12'>({{address.use}})</td></tr>" +
                "<tr ng-repeat='line in address.street_lines'><td class='col-md-12'>{{line}}</td></tr>" +
                "<tr><td class='col-md-12'>{{address.city}}, {{address.state}} {{address.zip}}</td></tr>"+
                "<tr ng-show='address.country'><td class='col-md-12'>{{address.country}}</td></tr></table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('orgEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><div ng-repeat='org in inputValue'><h4> {{inputTitle}} </h4>" +
                "<div ng-repeat='name in org.name'><div single-entry input-value='name' input-title='Name' ></div></div>"+
                "<div addresses-entry input-value='org.address' input-title='Address' ></div>"+
                "<div phone-entry input-value='org.phone' input-title='Phone' ></div>"+
                "</div></div>",
            link: function(scope, element, attrs) {}
        };
    }
])


.directive('performerEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> {{inputTitle}} </h4>" +
                "<div addresses-entry input-value='inputValue.address' input-title='Address'  ></div>"+
                "<div phone-entry input-value='inputValue.phone' input-title='Phone' ></div>"+
                "<div org-entry input-value='inputValue.organization' input-title='Organization' ></div>"+
                "<div coded-entry input-value='inputValue.code' input-title='Code' ng-show='inputValue.code'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])


.directive('wrappedperformerperformerEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> {{inputTitle}} </h4>" +
                "<div addresses-entry input-value='inputValue.performer.address' input-title='Address'  ></div>"+
                "<div phone-entry input-value='inputValue.performer.phone' input-title='Phone' ></div>"+
                "<div org-entry input-value='inputValue.performer.organization' input-title='Organization' ></div>"+
                "<div coded-entry input-value='inputValue.performer.code' input-title='Code' ng-show='inputValue.performer.code'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('performersEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><div ng-repeat='perf in inputValue'><h4> Performer </h4>" +
                "<div addresses-entry input-value='perf.address' input-title='Address'></div>"+
                "<div phone-entry input-value='perf.phone' input-title='Phone'></div>"+
                "<div org-entry input-value='perf.organization' input-title='Organization' ></div>"+
                "<div multicoded-entry input-value='perf.code' input-title='Code' ></div>"+
                "</div></div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//administration for immunization
.directive('administrationEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4>{{inputTitle}}</h4>" +
                "<div coded-entry input-value='inputValue.route' input-title='Route' ></div>"+
                "<div physicalquantity-entry input-value='inputValue.dose' input-title='Dose' ></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//instructions for immunization
.directive('instructionsEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4>{{inputTitle}}</h4>" +
                "<div coded-entry input-value='inputValue.code' input-title='Code' ></div>"+
                "<div single-entry input-value='inputValue.free_text' input-title='Free Text' ></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])
//languages for demographics
.directive('languagesEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4>Languages</h4><table class='table table-condensed' ng-repeat='lang in inputValue'" +
                "<thead><tr><th><b>{{lang.language | bb_language}}</b></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ><td class='col-md-12'>{{lang.mode}}</td></tr>" +
                "<tr ><td class='col-md-12'>Proficiency: {{lang.proficiency}}</td></tr>" +
                "<tr ng-show='lang.preferred'><td class='col-md-12'>Preferred</td></tr>" +
                "</table></div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//guardians for demographics
.directive('guardiansEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div ><div ng-repeat='guardian in inputValue'>" +
                "<h4>Guardians</h4>" +
                "<table class='table table-condensed' ng-repeat='name in guardian.names'>" +
                "<thead><tr><th><b>Name</b></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-12'>{{name.first}} {{name.middle.join(' ')}} {{name.last}}</td></tr></table>" +

            "<table class='table table-condensed' ng-repeat='phone in guardian.phone'>" +
                "<thead><tr><th><b>Phone</b></th><th class='col-md-12'></th></tr></thead>" +
                "<tr><td class='col-md-8'>{{phone.number}}</td><td class='col-md-4 text-left'>{{phone.type}}</td></tr></table>" +

            "<table class='table table-condensed' ng-repeat='address in guardian.addresses'>" +
                "<thead><tr><th><b>Address</b></th><th class='col-md-12'></th></tr></thead>" +
                "<tr ng-repeat='line in address.street_lines'><td class='col-md-12'>{{line}}</td></tr>" +
                "<tr><td class='col-md-12'>{{address.city}}, {{address.state}} {{address.zip}}</td></tr></table>" +

            "</div></div>",
            link: function(scope, element, attrs) {}
        };
    }
])
    .directive('dateEntry', ['$parse',
        function($parse) {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    inputValue: '=',
                    inputTitle: '@',
                    selectField: '='
                },
                template: "<table class='table table-condensed'>" +
                    "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12'></th></tr></thead>" +
                //"<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue[0].displayDate}}</td></tr>" +
                    "<tr ng-show='inputValue.point'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.point.date | date:'medium'}}</td></tr>" +
                    "<tr ng-show='inputValue.low && !inputValue.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.low.date | date:'medium'}} - PRESENT</td></tr>" +
                    "<tr ng-show='!inputValue.low && inputValue.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>... - {{inputValue.high.date | date:'medium'}}</td></tr>" +
                    "<tr ng-show='inputValue.low && inputValue.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.low.date | date:'medium'}} - {{inputValue.high.date | date:'medium'}}</td></tr>" +
                    "</table>",
                link: function(scope, element, attrs) {

                }
            };
        }
    ])


.directive('productEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.product.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.product.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.product.code_system_name}}</td></tr>" +
                "</table>" +
                "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>Manufacturer</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-12'><label style='text-transform: capitalize;'>{{inputValue.manufacturer}}</label></td></tr></table>" +
                "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>Lot Number</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-12'><label style='text-transform: capitalize;'>{{inputValue.lot_number}}</label></td></tr>" +
                "</table></div>",
            link: function(scope, element, attrs) {}
        };
    }
])


/* compact version draft
.directive('codedEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'>{{inputValue.name}}</th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code (System):</label></td><td class='col-md-4 text-left'>{{inputValue.code}} ({{inputValue.code_system_name}})</td></tr>" +
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])
*/

.directive('codedEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.code_system_name}}</td></tr>" +
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('wrappedcodecodedEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.code.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.code.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.code.code_system_name}}</td></tr>" +
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('wrappedvaluecodedEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.value.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.value.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.value.code_system_name}}</td></tr>" +
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('multicodedEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<table class='table table-condensed' ng-repeat='code in inputValue'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{code.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{code.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{code.code_system_name}}</td></tr>" +
                "</table>",
            link: function(scope, element, attrs) {}
        };
    }
])

//encounter for encounters
.directive('encounterEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.code_system_name}}</td></tr></table>" +
                "<table class='table table-condensed' ng-repeat='tran in inputValue.translations'>" +
                "<thead><tr><th><b>Translation</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{tran.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{tran.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{tran.code_system_name}}</td></tr>" +
                "</table></div",
            link: function(scope, element, attrs) {}
        };
    }
])


//locations for encounters
.directive('encounterlocationsEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><h4>{{inputTitle}}</h4><div ng-repeat='loc in inputValue'>"+
                "<div single-entry inputValue='inputValue.name' inputTitle='Name'>" +
                "<div coded-entry inputValue='inputValue.location_type' inputTitle='Location Type'>" +
                "<div addresses-entry inputValue='inputValue.address' inputTitle='Address'>" +

                "</div></div>",
            link: function(scope, element, attrs) {}
        };
    }
])


//finding for encounter
.directive('findingEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div>"+

                "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>{{inputTitle}}</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.value.name}}</td></tr>" +
                "<tr ng-show='inputValue.value.code && inputValue.value.code_system_name'><td class='col-md-4'><label style='text-transform: capitalize;'>Code (System):</label></td><td class='col-md-4 text-left'>{{inputValue.value.code}} ({{inputValue.value.code_system_name}})</td></tr>" +
                "</table>" +

                "<table class='table table-condensed' ng-show='inputValue.date_time'>" +
                "<thead><tr><th><b>Effective</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr ng-show='inputValue.date_time.low && inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.date_time.low.date | date:'medium'}} - {{inputValue.date_time.high.date | date:'medium'}}</td></tr>" +
                "<tr ng-show='inputValue.date_time.low && !inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.date_time.low.date | date:'medium'}} - PRESENT</td></tr>" +
                "<tr ng-show='!inputValue.date_time.low && inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>... - {{inputValue.date_time.high.date | date:'medium'}}</td></tr>" +
                "</table> <br/>" +
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//administration for medications
//TODO: need interval support
.directive('medsadministrationEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><h4>{{inputTitle}}</h4>"+
                "<div coded-entry input-value='inputValue.route' input-title='Route' select-field='selectedItems.route'></div>"+
                "<div coded-entry input-value='inputValue.form' input-title='Form' select-field='selectedItems.form'></div>"+
                "<div physicalquantity-entry input-value='inputValue.dose' input-title='Dose' select-field='selectedItems.dose'></div>"+
                "<div physicalquantity-entry input-value='inputValue.rate' input-title='Rate' select-field='selectedItems.rate'></div>"+
                "</div>",
            //templateUrl: "templates/matching/reconciliation/review/templates/sub/medsadministration.tpl.html",
            link: function(scope, element, attrs) {}
        };
    }
])

//product for medications
.directive('medsproductEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><h4>{{inputTitle}}</h4>"+
                "<div coded-entry input-value='inputValue.product' input-title='Name'></div>"+
                "<div ng-repeat='translation in inputValue.product.translations'>"+
                "<div coded-entry input-value='translation' input-title='Translation'></div>"+
                "</div>"+
                "<div single-entry input-value='inputValue.unencoded_name' input-title='Unencoded Name'></div>"+
                "<div single-entry input-value='inputValue.manufacturer' input-title='Manufacturer'></div>"+
                "</div>",
            //templateUrl: "templates/matching/reconciliation/review/templates/sub/medsadministration.tpl.html",
            link: function(scope, element, attrs) {}
        };
    }
])


//supply for medications
.directive('medssupplyEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> {{inputTitle}} </h4>" +
                "<div date-entry input-value='inputValue.date_time' input-title='Date'  ></div>"+
                "<div name-entry input-value='inputValue.author.name' input-title='Author' ></div>"+
                "<div single-entry input-value='inputValue.repeatNumber' input-title='Repeat Number' ></div>"+
                "<div single-entry input-value='inputValue.quantity' input-title='Quantity'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//indication for medications
.directive('medsindicationEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> {{inputTitle}} </h4>" +
                "<div date-entry input-value='inputValue.date_time' input-title='Date'  ></div>"+
                "<div coded-entry input-value='inputValue.code' input-title='Code' ></div>"+
                "<div coded-entry input-value='inputValue.value' input-title='Value' ></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//problem for problems
.directive('problemEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div>"+
                "<div coded-entry input-value='inputValue.code' input-title='Problem'></div>"+
                "<div date-entry input-value='inputValue.date_time' input-title='Date'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//problem_status for problems
.directive('problemstatusEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div>"+
                "<div single-entry input-value='inputValue.name' input-title='Status'></div>"+
                "<div date-entry input-value='inputValue.date_time' input-title='Date'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

//severity for allergies
.directive('severityEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div><table class='table table-condensed'>" +
                "<thead><tr><th><h4>Severity</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.code.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.code.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.code.code_system_name}}</td></tr></table>" +
                "<table class='table table-condensed'><thead><tr><th><b>Interpretation</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.interpretation.name}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.interpretation.code}}</td></tr>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.interpretation.code_system_name  | bb_trunc}}</td></tr>" +
                "</table></div>",
            link: function(scope, element, attrs) {}
        };
    }
])


//reaction for allergies
.directive('reactionEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                selectField: "="
            },
            template: "<div>"+
                "<table class='table table-condensed'>" +
                "<thead><tr><th><h4>Reaction</h4></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.reaction.name}}</td></tr>" +
                "<tr ng-show='inputValue.reaction.code && inputValue.reaction.code_system_name'><td class='col-md-4'><label style='text-transform: capitalize;'>Code (System):</label></td><td class='col-md-4 text-left'>{{inputValue.reaction.code}} ({{inputValue.reaction.code_system_name}})</td></tr>" +
                "</table>" +

                "<table class='table table-condensed'>" +
                "<thead><tr><th><b>Effective</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr ng-show='inputValue.date_time.low && inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.date_time.low.date | date:'medium'}} - {{inputValue.date_time.high.date | date:'medium'}}</td></tr>" +
                "<tr ng-show='inputValue.date_time.low && !inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>{{inputValue.date_time.low.date | date:'medium'}} - PRESENT</td></tr>" +
                "<tr ng-show='!inputValue.date_time.low && inputValue.date_time.high'><td class='col-md-4'><label style='text-transform: capitalize;'>Date:</label></td><td class='col-md-4 text-left'>... - {{inputValue.date_time.high.date | date:'medium'}}</td></tr>" +
                "</table>" +

                "<table class='table table-condensed'>" +
                "<thead><tr><th><b>Severity</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                "<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.severity.code.name}}</td></tr>" +
                "<tr ng-show='inputValue.severity.code && inputValue.severity.code_system_name'><td class='col-md-4'><label style='text-transform: capitalize;'>Code (System):</label></td><td class='col-md-4 text-left'>{{inputValue.severity.code}} ({{inputValue.severity.code_system_name}})</td></tr>" +
                "</table>" +

                //"<table class='table table-condensed'><thead><tr><th><b>Interpretation</b></th><th class='col-md-12' style='text-transform: capitalize;'></th></tr></thead>" +
                //"<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Name:</label></td><td class='col-md-4 text-left'>{{inputValue.severity.interpretation.name}}</td></tr>" +
                //"<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code:</label></td><td class='col-md-4 text-left'>{{inputValue.severity.interpretation.code}}</td></tr>" +
                //"<tr><td class='col-md-4'><label style='text-transform: capitalize;'>Code System:</label></td><td class='col-md-4 text-left'>{{inputValue.severity.interpretation.code_system_name | bb_trunc}}</td></tr>" +
                //"</table>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])



//result for results
.directive('resultEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                inputAdditional: '=',
                el: '=',
                selectField: "="
            },
            /*
            template: "<div>"+
                "<div coded-entry input-value='inputValue.result' input-title='Result'></div>"+
                "<div date-entry input-value='inputValue.date_time' input-title='Date'></div>"+
                "<div single-entry input-value='inputValue.status' input-title='Status'></div>"+
                "<div single-entry input-value='inputValue.interpretation' input-title='Interpretation'></div>"+
                "<div single-entry input-value='inputValue.value' input-title='Value'></div>"+
                "<div single-entry input-value='inputValue.unit' input-title='Unit'></div>"+
                "<div single-entry input-value='inputValue.reference_range.range' input-title='Reference Range'></div>"+

                "</div>",
            */
            //templateUrl: "templates/matching/reconciliation/review/templates/sub/medsadministration.tpl.html",
            templateUrl: "templates/matching/reconciliation/review/templates/sub/result.tpl.html",
            link: function(scope, element, attrs) {}
        };
    }
])



.directive('policyEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> Insurance </h4>" +
                "<div multisingle-entry input-value='inputValue.insurance.performer.organization[0].name' input-title='Name' ></div>"+
                "<div addresses-entry input-value='inputValue.insurance.performer.organization[0].address' input-title='Address'  ></div>"+
                //"<div phone-entry input-value='inputValue.phone' input-title='Phone' ></div>"+
                //"<div org-entry input-value='inputValue.organization' input-title='Organization' ></div>"+
                //"<div coded-entry input-value='inputValue.code' input-title='Code' ng-show='inputValue.code'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

.directive('policyholderEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> Policy Holder </h4>" +
                "<div single-entry input-value='inputValue.performer.identifiers[0].identifier' input-title='Plan ID'  ></div>"+
                //"<div phone-entry input-value='inputValue.phone' input-title='Phone' ></div>"+
                //"<div org-entry input-value='inputValue.organization' input-title='Organization' ></div>"+
                //"<div coded-entry input-value='inputValue.code' input-title='Code' ng-show='inputValue.code'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])
.directive('participantEntry', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                inputValue: '=',
                inputTitle: '@',
                selectField: '='
            },
            template: "<div><h4> Insured </h4>" +
                "<div singlesmall-entry input-value='inputValue.performer.identifiers[0].identifier' input-title='Plan ID'  ></div>"+
                "<div date-entry input-value='inputValue.date_time' input-title='' ng-show='inputValue.date_time'></div>"+
                "</div>",
            link: function(scope, element, attrs) {}
        };
    }
])

/*
<div class="panel-group" id="accordion">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
          Header
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse in">
      <div class="panel-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
</div>


    <div class="panel panel-default" id="accordion">
        <div class="panel-heading">
            <a data-toggle="collapse" data-parent="#accordion" data-target="#blah">
                <div class="panel-title" style="cursor:pointer;">
                    <span style="text-transform:uppercase;">name</span>
                </div>
            </a>
        </div>
        <div id="blah" class="panel-collapse collapse">
            <div class="panel-body">
                <div id="myTabContent" >

                    Content Here
                </div>
            </div>
        </div>
    </div>
*/


.directive('reviewNew', ['$parse',
    function($parse) {
        return {
            restrict: 'E',
            scope: {
                val: '=',
                title: '@'
            },
            replace: true,
            link: function(scope, element, attrs) {

                var entryType = function(input) {
                    var response = 'str';
                    if (angular.isObject(input)) {
                        response = 'obj';
                    }
                    if (angular.isArray(input)) {
                        response = 'arr';
                    }
                    return response;
                };

                if (entryType(scope.val) === 'str') {
                    var append_string = "<table class='table table-condensed table-hover'>" +
                        "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'>" + scope.title + "</th></tr></thead>" +
                        "<tr><td><input type='checkbox' value=''></td><td>" + scope.val + "</td></tr></table>";
                    element.append(append_string);
                }

                if (entryType(scope.val) === 'obj') {

                    var append_object = "<table class='table table-condensed table-hover'>" +
                        "<thead><tr><th class='col-md-2'><input type='checkbox' value=''></th><th style='text-transform: capitalize'>" +
                        scope.title + "</th></tr></thead>";

                    for (var i in scope.val) {

                        var append_obj_item = "<tr><td><input type='checkbox' value=''>" +
                            "</td><td><label style='text-transform: capitalize'>" + i + ":</label>  " + scope.val[i] + "</td></tr>";

                        append_object = append_object + append_obj_item;

                    }

                    append_object = append_object + "</table>";

                    element.append(append_object);

                }






                //console.log(element);

                //console.log(scope.val);

                // for (var i in scope.val) {

                //console.log(scope.val[i]);

                /*if (entryType(scope.val[i]) === 'str') {

                console.log(scope.val);        
                    
                    var append_string = "<table class='table table-condensed table-hover'>" + 
                                        "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'>" + scope.title + "</th></tr></thead>" + 
                                        "<tr><td><input type='checkbox' value=''></td><td>" + scope.val[i] + "</td></tr></table>";

                    element.append(append_string);

                }*/
                //  }

            }
        };
    }
]);

angular.module('services.account', [])

.service('account', ['$http', '$filter',
    function($http, $filter) {

        this.isAuthenticated= function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/account'
            }).success(function(data, status, headers, config) {
                callback(null, data.authenticated);
            }).error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });
        };

        this.getProfile = function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/account'
            }).
            success(function(data, status, headers, config) {
                //TODO: return account info
                callback(null, newCount);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });

        };
    }
]);
angular.module('services.fileDownload', [])

.service('fileDownload', ['$http', function ($http) {
    this.downloadFile = function(downloadUrl, callback) {
        $http.get(downloadUrl)
        .success(function(data) {
            callback(null, data);
        })
        .error(function(data) {
            callback(data);
        });
    };
}]);

angular.module('services.fileUpload', [])

.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, callback) {
        var fd = new FormData();
        fd.append('file', file);
        $http.put(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            callback(null, data);
        })
        .error(function(data){
            callback(data);
        });
    };
}]);

angular.module('services.getNotifications', [])

.service('getNotifications', ['$http', '$filter', 'recordFunctions',
    function($http, $filter, recordFunctions) {

        function getUserName(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/record/demographics'
            }).success(function(data, status, headers, config) {
                var displayName = '';
                if (data.demographics.length > 0) {
                    displayName = recordFunctions.formatName(data.demographics[0].name).displayName;
                } else {
                    displayName = ' ';
                }
                callback(null, displayName);
            }).error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });
        }

        function getNewCount (callback) {
            $http({
                method: 'GET',
                url: '/api/v1/merges'
            }).
            success(function(data, status, headers, config) {
                var newCount = 0;
                for (var i in data.merges) {
                    if (data.merges[i].merge_reason === 'new') {
                        if(data.merges[i].entry_type !== 'demographics') {
                            var merge_date = data.merges[i].merged;
                            var dateDiff = new Date() - new Date(merge_date);
                            //86400000 <- 24 hrs in milliseconds.
                            if (dateDiff < 86400000) {
                                newCount++;
                            }
                        }
                    }
                }
                callback(null, newCount);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                callback(data);
            });

        }

        this.getUpdate = function(callback) {
            $http({
                method: 'GET',
                url: '/api/v1/notification'
            }).
            success(function(data, status, headers, config) {

                var total_merges = data.notifications.new_merges + data.notifications.duplicate_merges;
                data.notifications.total_merges = total_merges;

                if (data.notifications.total_merges > 0) {
                    data.notifications.displayNotifications = true;
                } else {
                    data.notifications.displayNotifications = false;
                }

                getUserName(function(err, userName) {
                    data.notifications.displayName = userName;
                    getNewCount(function(err, newCount) {
                        data.notifications.new_count = newCount;
                        callback(null, data.notifications);

                    });
                    
                });

            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
        };

    }
]);
angular.module('services.recordFunctions', [])

.service('recordFunctions', ['$filter', '$http',

    function($filter, $http) {

        this.minDateFromArray = function(inputArray) {
            var sortedArray = $filter('orderBy')(inputArray, "-date");
            return sortedArray[0];
        };

        this.truncateName = function(inputName) {
            //console.log(inputName.length);
            if (inputName.length > 47) {
                inputName = inputName.substring(0, 47) + "...";
                //console.log(inputName);
            }
            return inputName;
        };

        //Builds field displayName attribute.
        this.extractName = function(inputSection, type) {

            //console.log('input section - ', type);
            //console.log(JSON.stringify(inputSection, null, 4));
            //console.log('----------------');

            inputSection.name = " ";

            try {
                if (type === "allergies") {
                    inputSection.name = inputSection.observation.allergen.name;
                } else if (type === "encounters") {
                    inputSection.name = inputSection.encounter.name;
                } else if (type === "immunizations") {
                    inputSection.name = inputSection.product.product.name;
                } else if (type === "medications") {
                    inputSection.name = inputSection.product.product.name;
                } else if (type === "problems") {
                    inputSection.name = inputSection.problem.code.name;
                } else if (type === "results") {
                    inputSection.name = inputSection.result_set.name;
                } else if (type === "procedures") {

                    if (inputSection.procedure.name) {
                        inputSection.name = inputSection.procedure.name;
                    } else if (inputSection.procedure.code) {
                        inputSection.name = "Procedure #" + inputSection.procedure.code;
                    } else {
                        inputSection.name = "Procedure Unknown";
                    }

                } else if (type === "vitals") {
                    inputSection.name = inputSection.vital.name;
                } else if (type === "plan_of_care") {
                    inputSection.name = inputSection.plan.name;
                } else if (type === "insurance" || type==='payers') {

                    var default_name = "Insurance";

                    console.log("insurance:", type,  JSON.stringify(inputSection,null,4));
                    console.log("basd");

                    //Just take first organizational name.
                    if (inputSection.policy) {
                        if (inputSection.policy.insurance) {
                            if (inputSection.policy.insurance.performer) {
                                if (inputSection.policy.insurance.performer.organization.length > 0) {
                                    if (inputSection.policy.insurance.performer.organization[0].name.length > 0) {
                                        inputSection.name = inputSection.policy.insurance.performer.organization[0].name[0];
                                    } else {
                                        inputSection.name = default_name;
                                    }
                                } else {
                                    inputSection.name = default_name;
                                }
                            } else {
                                inputSection.name = default_name;
                            }
                        } else {
                            inputSection.name = default_name;
                        }
                    } else {
                        inputSection.name = default_name;
                    }

                }
                //claims
                else if (inputSection.payer || inputSection.number) {
                    inputSection.name = "";
                    if (inputSection.payer) {
                        inputSection.name += inputSection.payer;
                    }
                    if (inputSection.number) {
                        inputSection.name = inputSection.payer[0];
                    }
                } else if (type === "social_history") {
                    inputSection.name = inputSection.code.name + " - " + inputSection.value;
                }
            } catch (e) {
                inputSection.name = "UNKNOWN";
            }

            /* merging display bug with date, fixed by BJ with moment.js library

            else if(inputSection.name){
                var tempName = "";
                if(inputSection.name.first){
                    tempName += inputSection.name.first;
                }
                if(inputSection.name.middle){
                    for(var x in inputSection.name.middle){
                        tempName += ' ' + inputSection.name.middle[x];
                    }
                }
                if(inputSection.name.last){
                    tempName += inputSection.name.last;
                }
            }

            else{
                inputSection.name = 'unknown';
            }

            //console.log('state of the name');
            //console.log(inputSection.name);
*/

            //Trim long names
            if (inputSection.name) {
                if (inputSection.name.length > 47) {
                    inputSection.name = inputSection.name.substring(0, 47) + "...";
                }
            }

            return inputSection;
        };

        //Returns printable array from address.
        this.formatAddress = function(address) {
            var displayAddress = [];
            if (address.street_lines.length > 0) {
                for (var addrLine in address.street_lines) {
                    displayAddress.push(address.street_lines[addrLine]);
                }
            }
            var cityLine = "";
            var cityTest = "";
            if (address.city) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.city + "," : cityLine = address.city + ",";
            }
            if (address.state) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.state : cityLine = address.state;
            }
            if (address.zip) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.zip : cityLine = address.zip;
            }
            if (cityLine.length > 0) {
                displayAddress.push(cityLine);
            }
            address.displayAddress = displayAddress;
            return address;
        };

        //Returns printable person name.
        this.formatName = function(inputName) {
            var outputName = "";

            //console.log(inputName);
            if (inputName.last && inputName.first) {
                outputName = inputName.first + " " + inputName.last;
            } else if (inputName.first) {
                outputName = inputName.first;
            } else if (inputName.last) {
                outputName = inputName.last;
            }

            //TODO:  Add middle name handler, prefix, and suffix.

            inputName.displayName = outputName;

            return inputName;
        };

        //Returns printable quantity/unit pair from values.
        this.formatQuantity = function(inputQuantity) {
            var returnQuantity = "";
            if (inputQuantity.value) {
                returnQuantity = inputQuantity.value;
            }
            if (inputQuantity.unit && inputQuantity.value) {
                returnQuantity = returnQuantity + " " + inputQuantity.unit;
            }
            inputQuantity.displayQuantity = returnQuantity;
            return inputQuantity;
        };

        this.formatDateTime = function(date_time) {
            if (!date_time) {
                return "DATE NOT REPORTED";
            }

            if (date_time.point) {
                return this.formatDate(date_time.point);
            } else if (date_time.low && date_time.high) {
                return this.formatDate(date_time.low) + " - " + this.formatDate(date_time.high);
            } else if (date_time.high) {
                return "... - " + this.formatDate(date_time.high);
            } else if (date_time.low) {
                return this.formatDate(date_time.low) + " - Present";
            } else if (date_time.center) {
                return this.formatDate(date_time.center);
            } else {
                return "DATE NOT REPORTED";
            }

        };

        //Returns printable Date.
        this.formatDate = function(date) {

            function formatOutput(input_date) {
                var tmpDateArr;

                if (input_date.precision === "year") {
                    tmpDateArr = moment.utc(input_date.date).format('YYYY');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "month") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM, YYYY');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "day") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "hour") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');

                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "minute") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "second") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "subsecond") {
                    tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                return tmpDateArr;
            }

            if (Object.prototype.toString.call(date) === '[object Array]') {
                if (date.length > 0) {
                    for (var d in date) {
                        //Array Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Array]') {
                            for (var de in date[d]) {
                                date[d][de] = formatOutput(date[d][de]);
                            }
                        }
                        //Object Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Object]') {
                            date[d] = formatOutput(date[d]);
                        }
                    }
                    return date;
                } else {
                    return date;
                }
            } else if (Object.prototype.toString.call(date) === '[object Object]') {
                return formatOutput(date);
            } else {
                //TODO:  Might need a single date handler here.
                return date;
            }
        };

        this.singularizeSection = (function() {
            var sectionMap = {
                allergies: 'allergy',
                demographics: 'demographic',
                medications: 'medication',
                social_history: 'social history',
                procedures: 'procedure',
                immunizations: 'immunization',
                vitals: 'vital',
                results: 'result',
                encounters: 'encounter',
                problems: 'problem',
                insurance: 'insurance',
                plan_of_care: 'plan of care',
                claims: 'claims'
            };

            return function(sectionName) {
                var result = sectionMap[sectionName];
                return result ? result : sectionName;
            };
        })();

        //makes sortable value out of date_time structure
        this.sortOrderDateTime = function(date_time) {
            if (!date_time) {
                return "Unknown";
            }

            if (date_time.high) {
                return date_time.high.date;
            } else if (date_time.point) {
                return date_time.point.date;
            } else if (date_time.low) {
                return date_time.low.date;
            } else {
                return "Unknown";
            }
        };

        //this method calculates display name and attribute on right side of display name e.g. date(or severity), sort order and other stuff
        this.updateFields = function(entries, section) {

            for (var i in entries) {

                this.extractName(entries[i], section);

                //console.log(entries[i]);

                entries[i].name = this.truncateName(entries[i].name);

                if (section === "allergies") {
                    var severityWeight = {
                        "MILD": 1,
                        "MILD TO MODERATE": 2,
                        "MODERATE": 3,
                        "MODERATE TO SEVERE": 4,
                        "SEVERE": 5,
                        "FATAL": 6
                    };

                    //replace attribute with severity
                    if (entries[i].observation.date_time) {
                        entries[i].attribute = this.formatDateTime(entries[i].observation.date_time);
                    } else {
                        entries[i].attribute = "DATE NOT REPORTED";
                    }

                    //console.log(JSON.stringify(entries[i], null, 4));

                    var severity;
                    if (entries[i].observation) {
                        if (entries[i].observation.severity) {
                            severity = entries[i].observation.severity.code.name;
                        }
                    }

                    entries[i].sort_order = (severity && severityWeight[severity.toUpperCase()]) || 0;
                } else if (section === "problems") {
                    //replace attribute with resolution flag??

                    var statusWeight = {
                        active: 3,
                        inactive: 2,
                        resolved: 1
                    };

                    if (angular.isDefined(entries[i].date_time)) {
                        entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    } else {
                        entries[i].attribute = 'DATE NOT REPORTED';
                    }
                    if (angular.isDefined(entries[i].status)) {
                        var status = entries[i].status.name;
                        entries[i].sort_order = (status && statusWeight[status.toLowerCase()]) || 0;
                    }

                    if (angular.isDefined(entries[i].onset_age)) {
                        if (angular.isDefined(entries[i].onset_age_unit)) {
                            entries[i].onsetAgeDisplay = entries[i].onset_age;
                        } else {
                            entries[i].onsetAgeDisplay = entries[i].onset_age;
                        }
                    }

                } else if (section === "results") {
                    //Results find date based on array
                    //TODO:  Improve so takes highest accuracy over lowest value.

                    var minDate="";

                    //find earlies date in test result and use it as attribute for entire battery/cluster
                    for (var j in entries[i].results) {
                        var curr = entries[i].results[j];
                        if (curr.date_time.point) {
                            //if min date is empty or more recent then current, update min date
                            if (!minDate || minDate.point.date > curr.date_time.point.date) {
                                minDate = curr.date_time;
                            }
                        }
                    }

                    entries[i].attribute = this.formatDateTime(minDate);
                    entries[i].sort_order = this.sortOrderDateTime(minDate);

                } else if (section === "medications") {
                    if (angular.isDefined(entries[i].date_time)) {
                        this.formatDateTime(entries[i].date_time);
                        entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);

                        if (entries[i].date_time.low) {
                            entries[i].attribute = entries[i].date_time.low.displayDate;
                        } else if (entries[i].date_time.high) {
                            entries[i].attribute = entries[i].date_time.high.displayDate;
                        } else if (entries[i].date_time.point) {
                            entries[i].attribute = entries[i].date_time.point.displayDate;
                        }



                    } else {
                        entries[i].attribute = "DATE NOT REPORTED";
                    }



                    if (angular.isDefined(entries[i].supply)) {
                        if (angular.isDefined(entries[i].supply.date_time)) {
                            this.formatDateTime(entries[i].supply.date_time);
                        }
                    }

                } else if (section === "payers") {

                    for (var pi in entries[i].policy.insurance.performer.organization) {
                        for (var api in entries[i].policy.insurance.performer.organization[i].address) {}
                    }
                } else if (section === "immunizations") {

                    //if (angular.isDefined(entries[i].date_time)) {
                    //    entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    //}

                        entries[i].attribute = this.formatDateTime(entries[i].date_time);


                    if (entries[i].performer) {
                        for (var ipi in entries[i].performer.name) {
                            this.formatName(entries[i].performer.name[ipi]);
                        }

                        for (var ipa in entries[i].performer.address) {
                            this.formatAddress(entries[i].performer.address[ipa]);
                        }

                    }

                    if (entries[i].administration && entries[i].administration.dose) {
                        this.formatQuantity(entries[i].administration.dose);
                    }

                } else if (section === "procedures") {

                    entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);

                    if (entries[i].performer) {
                        for (var iperf in entries[i].performer) {
                            if (entries[i].performer[iperf].name) {
                                for (var iperfname in entries[i].performer[iperf].name) {
                                    this.formatName(entries[i].performer[iperf].name[iperfname]);
                                }
                            }
                        }
                    }



                } else if (section === "encounters") {

                    entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);

                    if (entries[i].performers) {
                        for (var iper in entries[i].performers) {
                            if (entries[i].performers[iper].name) {
                                for (var ipername in entries[i].performers[iper].name) {
                                    this.formatName(entries[i].performers[iper].name[ipername]);
                                }

                            }
                        }
                    }

                }
                // social_history, vitals, procedures, immunizations
                else {

                    entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);

                }

            }
        };

        //new method to get all patients entries for specific section
        this.getEntries = function($scope, section) {
            //console.log("fetching " + section + " entires");

            var that = this;

            $http({
                method: 'GET',
                url: '/api/v1/record/' + section
            }).
            success(function(data, status, headers, config) {

                $scope.entries = data[section];

                if ($scope.entries.length > 0) {
                    $scope.display = true;
                    $scope.sort_predicate = "-sort_order";

                    that.updateFields($scope.entries, section);
                } else {
                    $scope.display = false;
                }

            }).
            error(function(data, status, headers, config) {
                console.log('error while fetching ' + section + ' entries');
            });

        };
    }
]);
