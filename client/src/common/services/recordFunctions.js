angular.module('services.recordFunctions', [])

.service('recordFunctions', ['$filter',

    function($filter) {

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
        this.extractName = function(inputSection) {

            //console.log(inputSection);

            if (inputSection.allergen) {
                inputSection.name = inputSection.allergen.name;
            }
            else if (inputSection.encounter) {
                inputSection.name = inputSection.encounter.name;
            }
            else if (inputSection.product) {
                inputSection.name = inputSection.product.product.name;
            }
            else if (inputSection.problem) {
                inputSection.name = inputSection.problem.name;
            }
            else if (inputSection.results) {
                inputSection.name = inputSection.result_set.name;
            }
            else if (inputSection.procedure) {
                inputSection.name = inputSection.procedure.name;
            }
            else if (inputSection.vital) {
                inputSection.name = inputSection.vital.name;
            }
            else if (inputSection.plan_name) {
                inputSection.name = inputSection.plan_name;
            }
            else if(inputSection.payer_name){
                inputSection.name = inputSection.payer_name;
            }
            else if (inputSection.smoking_statuses) {
                inputSection.name = "Smoking Status";
            }
            else{
                inputSection.name = 'unknown';
            }

            return inputSection;
        };

        //Returns printable array from address.
        this.formatAddress = function(address) {
            var displayAddress = [];
            if (address.streetLines.length > 0) {
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

        //Returns printable Date.
        this.formatDate = function(date) {

            function formatOutput(input_date) {
                var tmpDateArr;
                if (input_date.precision === "year") {
                    tmpDateArr = $filter('date')(input_date.date, 'yyyy');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "month") {
                    tmpDateArr = $filter('date')(input_date.date, 'MMM, yyyy');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "day") {
                    tmpDateArr = $filter('date')(input_date.date, 'mediumDate');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "hour") {
                    tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "minute") {
                    tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "second") {
                    tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                if (input_date.precision === "subsecond") {
                    tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                    input_date.displayDate = tmpDateArr;
                }
                return input_date;
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
            }
            else if (Object.prototype.toString.call(date) === '[object Object]') {
                return formatOutput(date);
            }
            else {
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
                problems: 'problem'
            };

            return function(sectionName) {
                var result = sectionMap[sectionName];
                return result ? result : sectionName;
            };
        })();
    }
]);
