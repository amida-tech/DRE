'use strict';

/**
 * @ngdoc service
 * @name phrPrototypeApp.format
 * @description
 * # format
 * Service in the phrPrototypeApp.
 */
angular.module('phrPrototypeApp')
    .service('format', function format() {

        //Takes date object, decorates with displayDate.
        this.formatDate = function (input_date) {
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
        };
        //Takes date object, decorates with displayDate.
        this.returnFormatDate = function (input_date) {
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
        };

        this.outputDate = function (date_time) {
            if (!date_time) {
                return "Date Not Reported";
            }

            if (date_time.point) {
                return date_time.point.displayDate;
            } else if (date_time.low && date_time.high) {
                return date_time.low.displayDate + " - " + date_time.high.displayDate;
            } else if (date_time.high) {
                return "... - " + date_time.high.displayDate;
            } else if (date_time.low) {
                return date_time.low.displayDate + " - Present";
            } else if (date_time.center) {
                return date_time.center.displayDate;
            } else {
                return "Date Not Reported";
            }
        };

        //Returns a plot date for timeline graphing.
        this.plotDate = function (date_time) {
            if (!date_time) {
                return null;
            }

            if (date_time.point) {
                return date_time.point.date;
            } else if (date_time.low && date_time.high) {
                return date_time.low.date;
            } else if (date_time.high) {
                return date_time.high.date;
            } else if (date_time.low) {
                return date_time.low.date;
            } else if (date_time.center) {
                return date_time.center.date;
            } else {
                return null;
            }
        };

        //Collapse Address to text entry.
        this.formatAddress = function (address) {
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
        //TODO:  Add middle name handler, prefix, and suffix.
        this.formatName = function (inputName) {
            var outputName = "";

            if (inputName.last && inputName.first) {
                outputName = inputName.first + " " + inputName.last;
            } else if (inputName.first) {
                outputName = inputName.first;
            } else if (inputName.last) {
                outputName = inputName.last;
            }

            inputName.displayName = outputName;

            return inputName;
        };

        this.formatQuantity = function (inputQuantity) {

            var quantityUnit = "";
            var returnQuantity = "";

            if (inputQuantity.unit) {

                if (inputQuantity.unit === "[in_i]") {
                    quantityUnit = "inches";
                } else if (inputQuantity.unit === "[lb_av]") {
                    quantityUnit = "lbs";
                } else if (inputQuantity.unit === "mm[Hg]") {
                    quantityUnit = "mm";
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
            inputQuantity.displayQuantity = returnQuantity;
            return inputQuantity;
        };

        //TODO:  Revisit this for better output formatting.
        this.formatInterval = function (inputInterval) {
            var returnInterval = "";
            if (inputInterval.period) {
                returnInterval = inputInterval.period.value + " " + inputInterval.period.unit;
            }
            inputInterval.displayInterval = returnInterval;
            return returnInterval;
        };

    });
