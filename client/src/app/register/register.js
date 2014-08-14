angular.module('dre.register', [])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/register', {
      templateUrl: 'templates/register/register.tpl.html',
      controller: 'registerCtrl'
    });
  }
])

.controller('registerCtrl', ['$scope', '$http', '$location',  
	function($scope, $http, $location) {

		$scope.inputUsername = '';
		$scope.inputPassword = '';
		$scope.regError = '';

		$scope.submitReg = function() {
			$http.post('/api/v1/register', {"username": $scope.inputUsername, "password": $scope.inputPassword})
			.success(function (data) {
				$scope.submitLogin();
				$location.path('/dashboard');
			}).error(function (data) {
				$scope.regError = data;
			});
		};

		$scope.submitLogin = function() {
			$http.post('api/v1/login', {"username": $scope.inputUsername, "password": $scope.inputPassword})
				.success(function (data) {
					callback(null, data);
				}).error(function (data) {
					callback(data);
				});
		};
	}
]);