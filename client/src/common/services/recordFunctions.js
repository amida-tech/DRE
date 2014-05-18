angular.module('services.recordFunctions', [])

.service('recordFunctions', ['$filter',

    function($filter) {

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



        this.formatDate = function(date) {
            if (Object.prototype.toString.call(date) === '[object Array]') {
                if (date.length > 0) {
                    for (var d in date) {

                        //Array Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Array]') {
                            for (var de in date[d]) {
                                var tmpDateArr;
                                if (date[d][de].precision === "day") {
                                    tmpDateArr = $filter('date')(date[d][de].date, 'mediumDate');
                                    date[d][de].displayDate = tmpDateArr;
                                }
                                if (date[d][de].precision === "subsecond") {
                                    tmpDateArr = $filter('date')(date[d][de].date, 'mediumDate');
                                    date[d][de].displayDate = tmpDateArr;
                                }
                            }
                        }

                        //Object Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Object]') {
                            var tmpDateObj;
                            if (date[d].precision === "day") {
                                tmpDateObj = $filter('date')(date[d].date, 'mediumDate');
                                date[d].displayDate = tmpDateObj;
                            }
                            if (date[d].precision === "subsecond") {
                                tmpDateObj = $filter('date')(date[d].date, 'mediumDate');
                                date[d].displayDate = tmpDateObj;
                            }
                        }

                    }
                    return date;
                } else {
                    return date;
                }
            } else {
                //TODO:  Might need a single date handler here.
                return date;
            }
        };

    }
]);