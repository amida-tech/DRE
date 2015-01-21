angular.module('dre.register', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'templates/register/register.tpl.html',
            controller: 'registerCtrl'
        });
    }
])

.controller('registerCtrl', ['$rootScope', '$scope', '$http', '$location', 'getNotifications',
    function($rootScope, $scope, $http, $location, getNotifications) {

        $scope.inputUsername = '';
        $scope.inputPassword = '';
        $scope.inputEmail = '';
        $scope.regError = '';

        $scope.firstname = '';
        $scope.middlename = '';
        $scope.lastname = '';
        $scope.dob = '';
        $scope.gender = '';

        // $scope.submitMessage = function(message) {
        //     flashmessage.setMessage(message);
        //     $location.path("/register");
        // };

        $scope.submitReg = function() {
            $http.post('/api/v1/register', {
                "username": $scope.inputUsername,
                "password": $scope.inputPassword,
                "email": $scope.inputEmail
            })
                .success(function(data) {
                    $scope.submitLogin();
                    $location.path('/dashboard');
                }).error(function(data) {
                    $scope.regError = data;
                });
        };

        $scope.submitLogin = function() {
            $http.post('api/v1/login', {
                "username": $scope.inputUsername,
                "password": $scope.inputPassword
            });
            //update with all registration info and POST to demographics section
            $http.post('api/v1/record/demographics', {
                "demographics.name.first": $scope.firstname = '',
                "demographics.name.middle": $scope.middlename = '',
                "demographics.name.last": $scope.lastname = '',
                //will need to do some date formatting here
                "demographics.dob": $scope.dob = '',
                "demographics.gender": $scope.gender = ''
            })
                .success(function(data) {
                    // $rootScope.isAuthenticated = true;
                    // $rootScope.notifications = {};
                    // getNotifications.getUpdate(function(err, notifications) {
                    //     $rootScope.notifications = notifications;
                    // });

                    $location.path('/dashboard');
                }).error(function(data) {
                    $rootScope.isAuthenticated = false;
                    $location.path('/home');
                });
        };


    }
]);
