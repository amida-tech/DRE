'use strict';

/**
 * @ngdoc filter
 * @name phrPrototypeApp.filter:format
 * @function
 * @description
 * # format
 * Filter in the phrPrototypeApp.
 */
angular
    .module('phrPrototypeApp')
    .filter('format', function () {
        return function (input, type) {
            if (_.isUndefined(input)) {
                return;
            }

            switch (type) {
            case 'address':

                var address = input;
                var displayAddress = '';

                var outputlines = '';

                if (address.street_lines.length > 0) {
                    for (var addrLine in address.street_lines) {
                        // displayAddress.push(address.street_lines[addrLine]);
                        outputlines = outputlines + address.street_lines[addrLine];
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
                    outputlines = outputlines + ', ' + cityLine;
                }
                return outputlines;

            case 'quantity':
                var inputQuantity = input;
                var quantityUnit = "";
                var returnQuantity = "";

                if (inputQuantity.unit) {

                    if (inputQuantity.unit === "[in_i]") {
                        quantityUnit = "inches";
                    } else if (inputQuantity.unit === "[lb_av]") {
                        quantityUnit = "lbs";
                    } else if (inputQuantity.unit === "mm[Hg]") {
                        quantityUnit = "mmHg";
                    } else if (inputQuantity.unit === "h") {
                        quantityUnit = "hour(s)";
                    } else {
                        quantityUnit = inputQuantity.unit;
                    }

                }

                if (inputQuantity.value) {
                    returnQuantity = inputQuantity.value;
                }
                if (inputQuantity.unit && inputQuantity.value) {
                    returnQuantity = returnQuantity + " " + quantityUnit;
                }
                if (returnQuantity === "") {
                    returnQuantity = inputQuantity;
                }
                return returnQuantity;

            case 'name':
                var inputName = input;
                var outputName = "";
                if (inputName.last && inputName.first) {
                    if (inputName.prefix) {
                        outputName = inputName.prefix + " " + inputName.first + " " + inputName.last;
                    } else {
                        outputName = inputName.first + " " + inputName.last;
                    }
                } else if (inputName.first) {
                    outputName = inputName.first;
                } else if (inputName.last) {
                    outputName = inputName.last;
                }

                return outputName;

            case 'date':
                var date_time = input;
                if (!date_time) {
                    return "Date Not Reported";
                }

                if (date_time.point) {
                    return formatDate(date_time.point);
                } else if (date_time.low && date_time.high) {
                    return formatDate(date_time.low) + " - " + formatDate(date_time.high);
                } else if (date_time.high) {
                    return "... - " + formatDate(date_time.high);
                } else if (date_time.low) {
                    return formatDate(date_time.low) + " - Present";
                } else if (date_time.center) {
                    return formatDate(date_time.center);
                } else {
                    return "Date Not Reported";
                }
            }
        };
    });

function formatDate(input_date) {
    var tmpDateArr;
    if (input_date.precision === "year") {
        tmpDateArr = moment.utc(input_date.date).format('YYYY');
    }
    if (input_date.precision === "month") {
        tmpDateArr = moment.utc(input_date.date).format('MMM, YYYY');
    }
    if (input_date.precision === "day") {
        tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY');
    }
    if (input_date.precision === "hour") {
        tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
    }
    if (input_date.precision === "minute") {
        tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
    }
    if (input_date.precision === "second") {
        tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
    }
    if (input_date.precision === "subsecond") {
        tmpDateArr = moment.utc(input_date.date).format('MMM D, YYYY h:mm a');
    }
    return tmpDateArr;
}
