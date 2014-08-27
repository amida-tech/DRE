/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('dre.nav', [])

.controller('navCtrl', ['$rootScope','$scope', '$http', '$location',
	function($rootScope, $scope, $http, $location) {

		$scope.logout = function() {
			$http.post('/api/v1/logout')
			.success(function (data) {
				$rootScope.isAuthenticated=false;
				$location.path('/home');
			}).error(function (data) {
				callback(data);
			});
		};
	}
]);