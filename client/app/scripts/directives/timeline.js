'use strict';
/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:timeline
 * @Takes two inputs, chartData and chartType.
 * # timeline
 */
angular.module('phrPrototypeApp').directive('timeline', function ($window, $location, $anchorScroll, d3Service) {
    return {
        restrict: 'EA',
        template: "<svg style='width:100%;'></svg>",
        link: function postLink(scope, element, attrs) {

            var plotHeight = 60;
            var boundaryOffset = 15;
            var boundaryWidth = 3;
            var boundaryLabelOffset = 30;
            var boundaryLabelPadding = 5;
            var plotBaseColor = "#6AA6FF";
            var plotCircles = [];
            var plotDomain = [];
            var timeScale;
            var timeScaleTicks = [];
            var d3 = $window.d3;
            var rawSvg = element.find("svg")[0];
            var svg = d3.select(rawSvg).attr("height", plotHeight);
            var format = d3.time.format("%m/%d/%Y");
            var isoFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
            var isoFormatSubsecond = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ");
            var tip = d3.tip();
            tip.attr('class', 'd3-tip').html(function (d) {
                return 'Entry';
            });
            svg.call(tip);

            function gatherData() {
                console.log("timeline gather data");
                //Clean variables (needed for refresh).
                var dataToPlot = [];
                plotCircles = [];
                plotDomain = [];
                dataToPlot = scope[attrs.chartData];
                var dataType = attrs.chartType;
                var tmpDomain = [];
                var minDate, maxDate, plotFloor, plotCeiling;
                if (dataType === 'account' && dataToPlot) { //&& dataToPlot if no data skip this part
                    console.log('>>>plotting account history');
                    console.log("num of points ", dataToPlot.length);
                    //console.log('in timeline plotting');
                    //console.log('plot data exists', dataToPlot);
                    for (var i in dataToPlot.recordHistory) {
                        var plotDate = isoFormatSubsecond.parse(dataToPlot.recordHistory[i].date);
                        //console.log('plot date', plotDate);
                        plotCircles.push({
                            "date": plotDate
                        });
                        tmpDomain.push(plotDate);
                    }
                    minDate = d3.min(tmpDomain);
                    maxDate = d3.max(tmpDomain);
                    plotFloor = d3.time.month.floor(d3.time.month.offset(minDate, -2));
                    plotCeiling = d3.time.month.floor(d3.time.month.offset(maxDate, 2));
                    plotDomain = [plotFloor, plotCeiling];
                } else if (dataType === 'merges' && dataToPlot) {
                    console.log('>>>plotting merges');
                    console.log("num of points ", dataToPlot.length);
                    _.each(dataToPlot, function (entry) {
                        var plotDate;
                        if (entry.merged) {
                            plotDate = isoFormat.parse(entry.merged);
                            //Redundancy for isoFormat subsecond support.
                            if (_.isNull(plotDate)) {
                                plotDate = isoFormatSubsecond.parse(entry.merged);
                            }
                            plotCircles.push({
                                "date": plotDate
                            });
                            tmpDomain.push(plotDate);
                        }
                    });
                    minDate = d3.min(tmpDomain);
                    maxDate = d3.max(tmpDomain);
                    plotFloor = d3.time.month.floor(d3.time.month.offset(minDate, -2));
                    plotCeiling = d3.time.month.floor(d3.time.month.offset(maxDate, 2));
                    plotDomain = [plotFloor, plotCeiling];

                } else {
                    console.log('>>>plotting something else');
                    console.log("num of points ", dataToPlot);

                    _.each(dataToPlot, function (entry) {
                        var plotDate;
                        if (entry.metadata.datetime) {
                            if (entry.metadata.datetime[0]) {
                                plotDate = isoFormat.parse(entry.metadata.datetime[0].date);

                            }
                            //Redundancy for isoFormat subsecond support.
                            if (_.isNull(plotDate)) {
                                plotDate = isoFormatSubsecond.parse(entry.metadata.datetime[0].date);
                            }
                            var tempCat = entry.category;
                            plotCircles.push({
                                "date": plotDate,
                                "category": tempCat.charAt(0).toUpperCase() + tempCat.slice(1)
                            });
                            tmpDomain.push(plotDate);
                        }
                    });
                    minDate = d3.min(tmpDomain);
                    maxDate = d3.max(tmpDomain);
                    plotFloor = d3.time.month.floor(d3.time.month.offset(minDate, -2));
                    plotCeiling = d3.time.month.floor(d3.time.month.offset(maxDate, 2));
                    plotDomain = [plotFloor, plotCeiling];
                }
            }

            function renderPlot() {
                    console.log("timeline render plot");

                    var width = 0;

                    function getSVGWidth() {
                        width = parseInt(svg.style('width'), 10);
                        console.log("svg width = " + width);
                        console.log("element width = " + element.width());

                        //Shim, keeps it from erroring on first pass.
                        if (width === 0) {
                            width = $window.innerWidth * 0.67;
                        }

                    }

                    function buildScale() {
                        timeScale = d3.time.scale().range([(boundaryOffset + (boundaryWidth / 2)), width - (boundaryOffset - (boundaryWidth / 2))]).domain(plotDomain);
                    }

                    function buildTicks() {
                        timeScaleTicks = [];
                        //TODO:  Configure this for monthly ticks.
                        var tmpTimeScaleTicks = timeScale.ticks(20);
                        for (var i in tmpTimeScaleTicks) {
                            timeScaleTicks.push({
                                "x_axis": timeScale(tmpTimeScaleTicks[i]),
                                "y_axis": (plotHeight - boundaryLabelOffset - boundaryLabelPadding) / 2
                            });
                        }
                    }

                    function structureData() {
                        for (var i in plotCircles) {
                            plotCircles[i].x_axis = timeScale(plotCircles[i].date);
                            plotCircles[i].y_axis = (plotHeight - boundaryLabelOffset - boundaryLabelPadding) / 2;
                            plotCircles[i].radius = 10;
                            plotCircles[i].color = plotBaseColor;
                            plotCircles[i].href = "entry" + i;
                        }
                    }

                    function plotData() {
                        svg.selectAll('*').remove();
                        var boundaryData = [{
                            "x": boundaryOffset,
                            "y": 0,
                            "width": boundaryWidth,
                            "height": plotHeight - boundaryLabelOffset - boundaryLabelPadding,
                            "color": plotBaseColor
                        }, {
                            "x": width - boundaryOffset,
                            "y": 0,
                            "width": boundaryWidth,
                            "height": plotHeight - boundaryLabelOffset - boundaryLabelPadding,
                            "color": plotBaseColor
                        }];
                        var plotLineData = [{
                            "x": boundaryOffset,
                            "y": ((plotHeight - boundaryLabelOffset - boundaryLabelPadding) / 2) - 1,
                            "width": width - boundaryOffset - boundaryOffset,
                            "height": 3,
                            "color": plotBaseColor
                        }];
                        var boundaryDisplayFormat = d3.time.format("%b %Y");
                        var boundaryLabel = [{
                            "x": 0,
                            "y": plotHeight - boundaryLabelPadding,
                            "anchor": "start",
                            "text": boundaryDisplayFormat(plotDomain[0])
                        }, {
                            "x": width,
                            "y": plotHeight - boundaryLabelPadding,
                            "anchor": "end",
                            "text": boundaryDisplayFormat(plotDomain[1])
                        }];
                        var boundaryLabels = svg.selectAll("text").data(boundaryLabel).enter().append("text");
                        var boundaryLabelAttributes = boundaryLabels.attr("x", function (d) {
                            return d.x;
                        }).attr("y", function (d) {
                            return d.y;
                        }).text(function (d) {
                            if (d.text === " 0NaN") { // Used for an empty timeline
                                return " ";
                            } else {
                                return d.text;
                            }
                        }).style("text-anchor", function (d) {
                            return d.anchor;
                        });
                        var boundaries = svg.selectAll("plotBoundary").data(boundaryData).enter().append("rect");
                        var boundaryAttributes = boundaries.attr("x", function (d) {
                            return d.x;
                        }).attr("y", function (d) {
                            return d.y;
                        }).attr("width", function (d) {
                            return d.width;
                        }).attr("height", function (d) {
                            return d.height;
                        }).style("fill", function (d) {
                            return d.color;
                        });
                        var plotLine = svg.selectAll("plotLine").data(plotLineData).enter().append("rect");
                        var plotLineAttributes = plotLine.attr("x", function (d) {
                            return d.x;
                        }).attr("y", function (d) {
                            return d.y;
                        }).attr("width", function (d) {
                            return d.width;
                        }).attr("height", function (d) {
                            return d.height;
                        }).style("fill", function (d) {
                            return d.color;
                        });
                        /*var plotLines = svg.selectAll("plotLines").data(timeScaleTicks).enter().append("circle");
                        var plotLineAttributes = plotLines
                            .attr("cx", function (d) {
                                //console.log(d);
                                return d.x_axis;
                            })
                            .attr("cy", function (d) {
                                return d.y_axis;
                            })
                            .attr("r", 2)
                            .style("fill", "#5bc0de")
                            .attr("class", "plotLines");*/
                        var circles = svg.selectAll("plotPoint").data(plotCircles).enter().append("circle");
                        var circleAttributes = circles.attr("cx", function (d) {
                            return d.x_axis;
                        }).attr("cy", function (d) {
                            return d.y_axis;
                        }).attr("r", function (d) {
                            return d.radius;
                        }).attr("class", "plotPoint").on('mouseover', function (d) {
                            var tipFormat = d3.time.format("%m/%d/%Y");
                            if (attrs.chartLocation === 'all') {
                                tip.attr('class', 'd3-tip animate').html(function (d) {
                                    return '<span>' + d.category + '</span> - <span>' + tipFormat(d.date) + '</span>';
                                }).show(d);
                            } else {
                                tip.attr('class', 'd3-tip animate').html(function (d) {
                                    return '<span>' + tipFormat(d.date) + '</span>';
                                }).show(d);
                            }
                        }).on('mouseout', function (d) {
                            tip.attr('class', 'd3-tip').show(d);
                            tip.hide();
                        });
                    }
                    getSVGWidth();
                    buildScale();
                    buildTicks();
                    structureData();
                    plotData();
                }
                //gatherData only on first run.
            $window.onload = function () {
                console.log('onload');
                gatherData();
                renderPlot();
            };

            //Re-evaluate scope on resize.
            $window.onresize = function () {
                scope.$apply();
                renderPlot();
            };
            //Expose function on master scope.

            scope.$watch('inactiveFlag', function (newValue, oldValue) {
                console.log('inactive flag ' + newValue + ' ' + oldValue);
                gatherData();
                renderPlot();
            }, true);
            scope.$watch('entryType', function (newValue, oldValue) {
                console.log('entry type ' + newValue + ' ' + oldValue);
                gatherData();
                renderPlot();
            }, true);
            scope.$watch('pageLoaded', function (newValue, oldValue) {
                console.log('page loaded ' + newValue + ' ' + oldValue);
                gatherData();
                renderPlot();
            }, true);
            scope.$watch('entryListFiltered', function (newValue, oldValue) {
                console.log('filter updated');
                gatherData();
                renderPlot();
            }, true);

            /*
            //Bind to updates in accountHistory var
            scope.$watch('accountHistory', function(newValue, oldValue) {
                console.log('acct history '+newValue+' '+oldValue);
                if (newValue) {
                    //console.log("act hist new val ", newValue);
                    gatherData();
                    renderPlot();
                }
            }, true);
            */

        }
    };
});
