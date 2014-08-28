angular.module('dre.home', [])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'templates/home/home.tpl.html',
            controller: 'homeCtrl'
        });
    }
])

.controller('homeCtrl', ['$rootScope', '$scope', '$http', '$location', 'getNotifications',
    function($rootScope, $scope, $http, $location, getNotifications) {
        $scope.inputUsername = '';
        $scope.inputPassword = '';

        $scope.submitInput = function() {
            $http.post('api/v1/login', {
                username: $scope.inputUsername,
                password: $scope.inputPassword
            })
                .success(function(data) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.notifications = {};
                    getNotifications.getUpdate(function(err, notifications) {
                        $rootScope.notifications = notifications;
                    });
                    $location.path('/dashboard');
                }).error(function(data) {
                    callback(data);
                });
        };
    }
]);
