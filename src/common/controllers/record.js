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

angular.module('phix.recordCtrl', ['bt.dropdown', 'bt.placeholder', 'bt.tooltip'])
	.controller('RecordCtrl', ['$scope', '$http',
		function($scope, $http) {
			$scope.tab = 'encounters';
			$scope.data = {};
			$scope.loaded = false;

			function load_master() {
				$http({
					method: 'GET',
					url: '/master'
				}).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.data = data;
					$scope.loaded = true;
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					//TODO: Do something?
					$scope.loaded = false;
				});
			}


			load_master();


			$scope.add = function(element, identifier) {
				mod_section(element, identifier, false);
			};


			$scope.remove = function(element, identifier) {
				mod_section(element, identifier, true);
			};


			function mod_section(element, identifier, ignored) {
				$http({
					method: 'POST',
					url: '/master/' + element,
					data: {
						identifier: identifier,
						approved: true,
						ignored: ignored,
						archived: false
					}
				}).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					load_master();
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.

					//TODO: Do something?
					load_master();
				});
			}


			$scope.activefilter = function(item) {
				return !item.archived && !item.ignored;
			};

		}
	]);