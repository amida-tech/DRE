angular.module('dre.home', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'templates/home/home.tpl.html',
      controller: 'homeCtrl'
    });
  }
])

.controller('homeCtrl', ['$scope', '$http', '$location',
  function($scope, $http, $location) {   
    $scope.inputUsername = '';
    $scope.inputPassword = '';

    $scope.submitInput = function() {
      $http.post('api/v1/login', {username: $scope.inputUsername, password: $scope.inputPassword})
        .success(function (data) {
          $location.path('/dashboard');
        }).error(function (data) {
          callback(data);
        });
    };
  }
]);