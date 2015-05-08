'use strict';

angular.module('d3', [])
    .factory('d3Service', ['$document', '$window', '$q', '$rootScope',
        function ($document, $window, $q, $rootScope) {
            var d = $q.defer(),
                dt = $q.defer(),
                d3service = {
                    d3: function () {
                        return d.promise;
                    },
                    d3tip: function () {
                        return dt.promise;
                    }
                };

            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function () {
                    d.resolve($window.d3);
                });
            }

            function onTipScriptLoad() {
                $rootScope.$apply(function () {
                    dt.resolve($window.d3tip);
                });
            }

            // Check if we already loaded d3
        if( typeof $window.d3 === 'undefined') {
        
            //d3 and d3-tip should be loaded sequntially, since d3-tip depends on d3
        d.promise.then( function() {

            var scriptTipTag = $document[0].createElement('script');
            scriptTipTag.type = 'text/javascript';
            scriptTipTag.async = true;
            scriptTipTag.src = 'bower_components/d3-tip/index.js';

            scriptTipTag.onreadystatechange = function () {
            if (this.readyState === 'complete') {
            onTipScriptLoad();
            }
            };

            scriptTipTag.onload = onTipScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTipTag);
        });

        (function() {
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'bower_components/d3/d3.js';

            scriptTag.onreadystatechange = function () {
            if (this.readyState === 'complete') {
            onScriptLoad();
            }
            };

            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
        })();
        
            } else {
            // Have it - just resolve Promises
        d.resolve($window.d3);
        dt.resolve($window.d3tip);
        }
        
            return d3service;
        }
    ])

;
