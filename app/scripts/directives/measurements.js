'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:measurements
 * @description
 * # measurements
 */
angular.module('phrPrototypeApp').directive('d3template', ['$window', '$timeout', 'd3Service',
    function($window, $timeout, d3Service) {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            link: function(scope, ele, attrs) {
                //bring in d3 code as a service
                d3Service.d3().then(function(d3) {
                    var renderTimeout;
                    var margin = {
                        top: 0,
                        right: 20,
                        bottom: 28,
                        left: 50
                    },
                        w = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right,
                        h = 200 - margin.top - margin.bottom;
                    //set initial svg values
                    var svg = d3.select(ele[0]).append('svg').attr('class', 'chart').attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                    //watch window resize to re-render
                    $window.onresize = function() {
                        scope.$apply();
                    };
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });
                    //watch your attributes for changes to re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        scope.render(newVals);
                    }, true);
                    //called to render chart
                    scope.render = function(data) {
                        //clean svg
                        svg.selectAll('*').remove();
                        //check to see if there is any data before drawing the chart (enable when using data attribute)
                        //if (!data)
                        //  return;
                        if (renderTimeout) {clearTimeout(renderTimeout);}
                        renderTimeout = $timeout(function() {
                            //updates chart size on page resize
                            if (d3.select(ele[0]).node().offsetWidth > 0) {
                                w = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right;
                                h = d3.select(ele[0]).node().offsetHeight - margin.top - margin.bottom;
                                svg.attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom);
                            }
                            //write your chart code here!
                            svg.append('rect').attr('width', w).attr('height', h).attr('fill', 'black');
                        }, 100);
                    };
                });
            }
        };
    }
]).directive('measurements', function($window) {
    return {
        template: '<svg></svg>',
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            //Initial Variables.
            var d3 = $window.d3;
            var rawSvg = element.find("svg")[0];
            var svg = d3.select(rawSvg);
            var vitals = scope.entries.vitals;
            var graphVitals = [];
            var graphVitalsTwo = [];
            var graphDates = [];
            var graphValues = [];
            var margin = 60;
            var width = 400;
            var height = 200;
            //Override variables.
            if (attrs.svgWidth) {
                width = attrs.svgWidth;
            }
            if (attrs.svgHeight) {
                width = attrs.svgHeight;
            }
            //ISO 8601 Format.
            var format = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
            svg.attr("height", height);
            svg.attr("width", width);
            //Restructure for graph.
            _.each(vitals, function(entry) {
                var tmpVital = {};
                if (attrs.graphType === "weight") {
                    if (entry.data.vital.name === "Patient Body Weight - Measured") {
                        tmpVital.value = entry.data.value;
                        tmpVital.unit = entry.data.unit;
                        tmpVital.date = format.parse(entry.data.date_time.point.date);
                        graphVitals.push(tmpVital);
                        graphDates.push(tmpVital.date);
                        graphValues.push(tmpVital.value);
                    }
                }
                if (attrs.graphType === "bloodPressure") {
                    if (entry.data.vital.name === "Intravascular Diastolic") {
                        tmpVital.value = entry.data.value;
                        tmpVital.unit = entry.data.unit;
                        tmpVital.date = format.parse(entry.data.date_time.point.date);
                        graphVitals.push(tmpVital);
                        graphDates.push(tmpVital.date);
                        graphValues.push(tmpVital.value);
                    }
                    if (entry.data.vital.name === "Intravascular Systolic") {
                        tmpVital.value = entry.data.value;
                        tmpVital.unit = entry.data.unit;
                        tmpVital.date = format.parse(entry.data.date_time.point.date);
                        graphVitalsTwo.push(tmpVital);
                        graphDates.push(tmpVital.date);
                        graphValues.push(tmpVital.value);
                    }
                }
            });
            var padding = 30;
            var pathClass = "path";
            var xTimeScale, yTimeScale, xAxisGen, yAxisGen, lineFun;

            function setChartParameters() {
                xTimeScale = d3.time.scale().domain([d3.min(graphDates), d3.max(graphDates)]).range([padding - 2, rawSvg.clientWidth - padding - 2]);
                yTimeScale = d3.scale.linear().domain([d3.min(graphValues) - (d3.min(graphValues) * 0.1), d3.max(graphValues) + (d3.max(graphValues) * 0.1)]).range([rawSvg.clientHeight - padding, 0]);
                xAxisGen = d3.svg.axis().scale(xTimeScale).orient("bottom").tickFormat(d3.time.format("%m/%d")).outerTickSize([2]).tickValues([d3.min(graphDates), d3.max(graphDates)]);
                yAxisGen = d3.svg.axis().scale(yTimeScale).orient("left").ticks(4).outerTickSize([2]);
                lineFun = d3.svg.line().x(function(d) {
                    return xTimeScale(d.date);
                }).y(function(d) {
                    return yTimeScale(d.value);
                }).interpolate("basis");
            }

            function drawLineChart() {
                setChartParameters();
                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + (height - (padding) + 10) + ")")
                    .call(xAxisGen);
                
                svg.append("svg:g")
                    .attr("class", "y axis").attr("transform", "translate(" + (padding) + ",10)")
                    .call(yAxisGen);

                if (graphVitals.length > 0) {
                    svg.append("svg:path").attr({
                        d: lineFun(graphVitals),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    });
                }
                if (graphVitalsTwo.length > 0) {
                    svg.append("svg:path").attr({
                        d: lineFun(graphVitalsTwo),
                        "stroke": "blue",
                        "stroke-width": 2,
                        "fill": "none",
                        "class": pathClass
                    });
                }
            }
            drawLineChart();
        }
    };
});