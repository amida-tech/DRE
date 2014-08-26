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
                inputSection.name = inputSection.code.code;
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
            console.log('state of the name');
            console.log(inputSection.name);

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
    }
]);
