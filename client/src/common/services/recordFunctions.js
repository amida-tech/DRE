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

            if (type === "allergies") {
                inputSection.name = inputSection.observation.allergen.name;
            } else if (type === "payers") {
                inputSection.name = "[payers]";
            } else if (type === "plan_of_care") {
                inputSection.name = "[plan of care]";
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
                inputSection.name = inputSection.procedure.name;
            } else if (type === "vitals") {
                inputSection.name = inputSection.vital.name;
            }
            //insurance
            else if (inputSection.plan_name) {
                inputSection.name = inputSection.plan_name;
            } else if (inputSection.payer_name) {
                inputSection.name = inputSection.payer_name;
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
            if (date_time.point) {
                return this.formatDate(date_time.point);
            } else if (date_time.low && date_time.high) {
                return this.formatDate(date_time.low) + " - " + this.formatDate(date_time.high);
            } else if (date_time.high) {
                return "... - " + this.formatDate(date_time.high);
            } else if (date_time.low) {
                return this.formatDate(date_time.low) + " - Present";
            } else {
                return "Unknown";
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
                social_history: 'social',
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
                    entries[i].attribute = this.formatDateTime(entries[i].date_time);

                    var severity = entries[i].observation.severity.code.name;
                    entries[i].sort_order = (severity && severityWeight[severity.toUpperCase()]) || 0;
                } else if (section === "problems") {
                    //replace attribute with resolution flag??

                    var statusWeight = {
                        active: 3,
                        inactive: 2,
                        resolved: 1
                    };

                    entries[i].attribute = this.formatDateTime(entries[i].date_time);

                    var status = entries[i].status.name;
                    entries[i].sort_order = (status && statusWeight[status.toLowerCase()]) || 0;
                } else if (section === "results") {
                    //Results find date based on array
                    //TODO:  Improve so takes highest accuracy over lowest value.

                    var minDate;

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

                    console.log("minDate ", minDate);
                    entries[i].attribute = this.formatDateTime(minDate);
                    entries[i].sort_order = this.sortOrderDateTime(minDate);

                    console.log(entries[i].attribute);
                }
                else if (section==="medications"){
                    entries[i].attribute = entries[i].status;
                    entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);
                }
                // social_history, vitals, procedures, immunizations, encounters
                else {
                    entries[i].attribute = this.formatDateTime(entries[i].date_time);
                    entries[i].sort_order = this.sortOrderDateTime(entries[i].date_time);
                }

            }
        };

        //new method to get all patients entries for specific section
        this.getEntries = function($scope, section) {
            console.log("fetching " + section + " entires");

            var that = this;

            $http({
                method: 'GET',
                url: '/api/v1/record/' + section
            }).
            success(function(data, status, headers, config) {
                console.log(section + JSON.stringify(data));
                $scope.entries = data[section];

                console.log(section + $scope.entries);
                console.log(section + " length:", $scope.entries.length);

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
