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
            })
                .success(function(data) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.notifications = {};
                    getNotifications.getUpdate(function(err, notifications) {
                        $rootScope.notifications = notifications;
                    });

                    $location.path('/dashboard');
                }).error(function(data) {
                    $rootScope.isAuthenticated = false;
                    $location.path('/home');
                });
        };
    }
]);
