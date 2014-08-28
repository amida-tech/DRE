angular.module('dre.login', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/login', {
      templateUrl: 'templates/login/login.tpl.html',
      controller: 'loginCtrl'
    });
  }
])

.controller('loginCtrl', ['$scope', '$http', '$location',
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