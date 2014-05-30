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

var dre = angular
    .module('dre', [
        'ngRoute',
        'dre.record',
        'dre.storage',
        'dre.dashboard',
        'dre.demographics',
        'dre.match',
        'dre.match.review',
        'directives.fileModel',
        'services.fileUpload',
        'services.getNotifications',
        'services.recordFunctions'
    ])
    .filter('bb_date', function($filter) {
      //Format Blue Button date JSON struct into string (with precision)

        return function(input_date) {
            if (typeof input_date ==="undefined") {return "";}

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
    .filter('bb_name', function($filter) {
      //Format Blue Button name JSON struct into string

        return function(input_name) {
            if (typeof input_name ==="undefined") {return "";}

            var full_name;

            if (input_name.first) {full_name=input_name.first+" ";}

            if (input_name.middle && input_name.middle.length>0) {
              for (var m in input_name.middle){
                full_name=full_name+input_name.middle[m]+" ";  
              }
            }

            if (input_name.last) {full_name=full_name+input_name.last;}

            full_name=full_name.trim();

            
            return full_name;
        };
    })
    .filter('bb_address', function($filter) {
      //Format Blue Button address JSON struct into string

        return function(address) {
            if (typeof address ==="undefined") {return "";}

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


.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/dashboard/dashboard.tpl.html',
            controller: 'dashboardCtrl'
        });

    }
])
// Note TabService is included but not used to ensure its been instantiated
.run(['$rootScope', '$location',
    function($rootScope, $location) {

    }
]);
