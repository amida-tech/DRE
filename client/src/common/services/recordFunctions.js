angular.module('services.recordFunctions', [])

.service('recordFunctions', ['$filter',

    function($filter) {

        this.formatDate = function(date) {
            if (Object.prototype.toString.call(date) === '[object Array]') {
                if (date.length > 0) {
                    for (var d in date) {

                        //Array Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Array]') {
                            for (var de in date[d]) {
                                if (date[d][de].precision === "day") {
                                    var tmpDateArr = $filter('date')(date[d][de].date, 'mediumDate');
                                    date[d][de].displayDate = tmpDateArr;
                                }
                            }
                        }

                        //Object Handler.
                        if (Object.prototype.toString.call(date[d]) === '[object Object]') {
                                if (date[d].precision === "day") {
                                    var tmpDateObj = $filter('date')(date[d].date, 'mediumDate');
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