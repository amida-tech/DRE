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

            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'bower_components/d3/d3.js';

            var scriptTipTag = $document[0].createElement('script');
            scriptTipTag.type = 'text/javascript';
            scriptTipTag.async = true;
            scriptTipTag.src = 'scripts/assets/d3-tip/index.js';

            scriptTag.onreadystatechange = function () {
                if (this.readyState === 'complete') {
                    onScriptLoad();
                }
            };

            scriptTipTag.onreadystatechange = function () {
                if (this.readyState === 'complete') {
                    onTipScriptLoad();
                }
            };

            scriptTag.onload = onScriptLoad;
            scriptTipTag.onload = onTipScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
            s.appendChild(scriptTipTag);

            return d3service;
        }
    ])

;
