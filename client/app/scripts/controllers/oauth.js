'use strict';

/**
 * @ngdoc function
 * @name phrPrototypeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the phrPrototypeApp
 */
angular
    .module('phrPrototypeApp')
    .controller('OAuthCtrl', OAuth);

OAuth.$inject = ['$location', '$window', '$routeParams', 'authentication'];

function OAuth($location, $window, $routeParams, authentication) {
    /* jshint validthis: true */
    var vm = this;
    vm.loggedin = false;
    vm.disableButton = true;

    console.log("route params: ",$routeParams);

    function getClient() {
        if ($routeParams.clientId) {
            authentication.getClient($routeParams.clientId,function(err,client) {
                if (err) {
                    console.log("err: ",err);
                } else {
                    vm.client = client;
                    authentication.decisionAuth($routeParams.redirectUri, $routeParams.clientId, $routeParams.responseType, function(err2){
                        if (err) {
                            console.log("err2: ",err2);
                        } else {
                            vm.disableButton = false;
                        }
                    });
                }
            });
        }
    }

    authentication.authStatus(function(err,status){
        if (err) {
            console.log("err: ",err);
        } else {
            vm.loggedin = status;
            if (status) {
                getClient();
            }
        }
    });

    vm.login = function () {
        authentication.login(vm.inputLogin, vm.inputPassword, function (err) {
            if (err) {
                vm.error = err;
            } else {
                vm.loggedin = true;
                getClient();
            }
        });
    };

    vm.deny = function () {
        authentication.denyAuth();
    };

    vm.authorize = function () {
        authentication.approveAuth();
    };
}
