angular.module('directives.matchingObjects', [])

.directive('singleEntry', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputValue: '=',
            inputTitle: '@',
            inputPath: '@',
            selectClick: '&'
        },
        link: function(scope, element, attrs) {

            console.log(scope.selectClick);

            var output_table = "<table class='table table-condensed table-hover'>" + 
                              "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'><label>" +
                              scope.inputTitle + "</label></th></tr></thead>";

            var output_table_end = "</table>";

            var output_table_line = "<tr><td><input type='checkbox' ng-model='currentSelection' ng-change='" + scope.selectClick() + "'></td>" +
                                    "<td>" + scope.inputValue + "</td></tr>";

            output_table = output_table + output_table_line;
            output_table = output_table + output_table_end;
            element.append(output_table);
        }
    };
}])

.directive('dateEntry', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputValue: '=',
            inputTitle: '@'
        },
        link: function(scope, element, attrs) {

            var output_table = "<table class='table table-condensed table-hover'>" + 
                              "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'><label>" +
                              scope.inputTitle + "</label></th></tr></thead>";

            var output_table_end = "</table>";

            for (var i in scope.inputValue) {
                
                //console.log(i);
                //console.log(scope.inputValue[i]);
               var output_table_line = "<tr><td><input type='checkbox' value=''></td>" +
                                       "<td><label style='text-transform: capitalize;'>" + "Date" + ":</label>  " + scope.inputValue[i].date + "</td></tr>";
               output_table = output_table + output_table_line;
            }

    
            output_table = output_table + output_table_end;
            element.append(output_table);
        }
    };
}])



.directive('codedEntry', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputValue: '=',
            inputTitle: '@',
            inputAdditional: '='
        },
        link: function(scope, element, attrs) {

            var output_table = "<table class='table table-condensed table-hover'>" + 
                              "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'>" +
                              scope.inputTitle + "</th></tr></thead>";

            var output_table_end = "</table>";

            if (scope.inputAdditional !== undefined) {
                if (scope.inputAdditional.severity) {
                    scope.inputValue.severity = scope.inputAdditional.severity;
                }
            }

            for (var i in scope.inputValue) {
                var displayName = '';
                if (i === 'code_system_name') {
                    displayName = 'Code System';
                } else {
                    displayName = i;
                }
                var output_table_line = "<tr><td><input type='checkbox' value=''></td>" +
                                        "<td><label style='text-transform: capitalize;'>" + displayName + ":</label>  " + scope.inputValue[i] + "</td></tr>";
                output_table = output_table + output_table_line;
            }

            output_table = output_table + output_table_end;
            element.append(output_table);
        }
    };
}])






.directive('reviewNew', ['$parse', function ($parse) {
    return {
        restrict: 'E',
        scope: {
            val: '=',
            title: '@'
        },
        replace: true,
        link: function (scope, element, attrs) {

            var entryType = function (input) {
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
}]);

