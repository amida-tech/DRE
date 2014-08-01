angular.module('directives.matchingObjects', [])

.directive('singleEntry', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputValue: '=',
            inputTitle: '@',
            selectField: '='
        },
        template: "<table class='table table-condensed table-hover'>" + 
                  "<thead><tr><th class='col-md-2'></th><th style='text-transform: capitalize'><label>{{inputTitle}}</label></th></tr></thead>" + 
                  "<tr><td><input type='checkbox' ng-model='selectField'></td>" +
                  "<td>{{inputValue}}</td></tr>",
        link: function(scope, element, attrs) {
        }
    };
}])

.directive('dateEntry', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            inputValue: '=',
            inputTitle: '@',
            selectField: '='
        },
        template: "<table class='table table-condensed table-hover'>" + 
                  "<thead><tr><th class='col-md-2'><input type='checkbox' ng-model='selectField.selectAll'></th><th style='text-transform: capitalize'>{{inputTitle}}</th></tr></thead>" +
                  "<tr ng-repeat='(inputTitle, inputLine) in inputValue'><td><input type='checkbox' ng-model='$parent.selectField.date'></td>" +
                  "<td><label style='text-transform: capitalize;'>Date:</label>  {{inputLine.date}}</td></tr>" +
                  "</table>",
        link: function(scope, element, attrs) {

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
            inputAdditional: '=',
            selectField: "="
        },
        template: "<table class='table table-condensed table-hover'>" + 
                  "<thead><tr><th class='col-md-2'><input type='checkbox' ng-model='selectField.selectAll'></th><th style='text-transform: capitalize'>{{inputTitle}}</th></tr></thead>" +
                  "<tr ng-repeat='(inputTitle, inputLine) in inputValue'><td><input type='checkbox' ng-checked='selAll' ng-model='$parent.selectField[inputTitle]'></td>" +
                  "<td><label style='text-transform: capitalize;'>{{inputTitle}}:</label>  {{inputLine}}</td></tr>" +
                  "</table>",
        link: function(scope, element, attrs) {
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

