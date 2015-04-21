var _ = require("underscore");
var fs = require("fs");

var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    screen = blessed.screen(),
    grid = new contrib.grid({
        rows: 2,
        cols: 1,
        screen: screen
    });

var bar = grid.set(0, 0, 1, 1, contrib.bar, {
    label: 'Avg. number of executions/sec',
    barWidth: 6,
    barSpacing: 10,
    xOffset: 1,
    maxHeight: 9
});

var data = fs.readFileSync('lib/benchmark/benchmark.json', "utf8");
data = data.trim().replace(/,+$/, "");
data = "[".concat(data).concat("]");
// console.log(data);
data = JSON.parse(data);

screen.append(bar); //must append before setting data
bar.setData({
    titles: _.map(data, function (obj) {
        return obj.test;
    }),
    data: _.map(data, function (obj) {
        // console.log(obj);
        return _.reduce(obj.runs, function (memo, num) {
            return memo + num;
        }, 0) / obj.runs.length;
    })
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.render();
