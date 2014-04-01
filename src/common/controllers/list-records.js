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

angular.module('phix.listRecordsCtrl', ['phix.authenticationService'])
	.controller('ListRecordsCtrl', ['$scope', '$http', 'AuthenticationService',
		function($scope, $http, AuthenticationService) {

			$scope.data = {};
			$scope.details = "";
			$scope.loaded = false;

			var endpoint = "/";


			$scope.modal = {};

			$scope.contentType = function(str) {
				if (str === "CCDA") {
					return "Blue Button (CCDA)";
				} else {
					return str;
				}
			};

			function load_store() {
				$http({
					method: 'GET',
					url: '/storage'
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


			load_store();
			$scope.filename = "";
			$scope.uploaded = false;

			$scope.upload = function() {
				//alert("upload");
				var f = document.getElementById('filename').files[0];

				var fReader = new FileReader();
				fReader.readAsText(f);

				fReader.onloadend = function(event) {
					var filedata = event.target.result;

					$scope.$apply(function() {
						//alert("fileloaded");

						$http.defaults.headers.post["Content-Type"] = "application/json";
						$http({
							method: 'PUT',
							url: '/storage',
							data: {
								filename: f.name,
								file: filedata,
								source: "upload",
								details: $scope.details
							}
						}).
						success(function(data, status, headers, config) {
							// this callback will be called asynchronously
							// when the response is available
							//alert("success");
							$scope.uploaded = true;
							$scope.details = "";
							document.getElementById('filename').value = "";
							load_store();
						}).
						error(function(data, status, headers, config) {
							// called asynchronously if an error occurs
							// or server returns response with an error status.
							$scope.uploaded = false;
							//alert("fail");

						});
					});
				};
			};

			$scope.download = function(id) {
				alert("download" + id);
			};

			$scope.merge = function(id) {
				//alert("merge "+id);
				$http.defaults.headers.post["Content-Type"] = "application/json";
				$http({
					method: 'POST',
					url: '/storage',
					data: {
						identifier: id,
						parsedFlag: true
					}
				}).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					//alert("success");
					load_store();

				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					//alert("fail");

				});
			};

			$scope.previewHidden = true;

			$scope.loadPreview = function(identifier) {
				$scope.recordData = {};

				console.log(identifier);
				$http.post(endpoint + 'storage/preview', {
					'identifier': identifier
				}).success(function(data) {
					$scope.recordData = data;
					$scope.tab = 'allergies';
					$scope.previewHidden = false;
				}).error(function(data) {
					console.log(data);
				});


			};

			$scope.hidePreview = function() {
				$scope.recordData = {};
				$scope.tab = 'allergies';
				$scope.previewHidden = true;
			};

			$scope.delete = function(id) {
				//alert("delete "+id);

				$http.delete(endpoint + 'storage/' + id).success(function(data) {
					console.log(data);
					load_store();
				}).error(function(data) {
					console.log(data);
				});
			};


		}
	]);