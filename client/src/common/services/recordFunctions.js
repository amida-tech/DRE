angular.module('services.recordFunctions', [])

.service('recordFunctions', ['$filter',

    function($filter) {

        this.formatDate = function(date) {
            if (Object.prototype.toString.call(date) === '[object Array]') {
                if (date.length > 0) {
                    for (var d in date) {
                        if (date[d].length > 0) {
                            for (var de in date[d]) {
                        if (date[d][de].precision === "day") {
                            var tmpDate = $filter('date')(date[d][de].date, 'mediumDate');
                            date[d][de].displayDate = tmpDate;
                        }




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