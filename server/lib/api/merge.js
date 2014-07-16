module.exports = function (app) {
    var Promise = require('bluebird');
    var record = Promise.promisifyAll(require('blue-button-record'));
    var config = require('config');
    var supportedComponents = config.supportedComponents;

    //Get all merges API.
    app.get('/api/v1/merges/:component', function(req, res) {
        if (!supportedComponents[req.params.component]) {
            app.winston.warn(404 + ' supportedComponent could not be found');
            res.send(404);
        } else {
            record.getMergesAsync(req.params.component, 'test', 'name severity', 'filename uploadDate').then(function(mergeList) {
                res.send({merges: mergeList});
            })
            .catch(function(e) {
                app.winston.warn(400 + ' Bad Request: ', e);
                res.send(400, e);
            });
        }
    });

    app.get('/api/v1/merges', function(req, res) {
        var mergeJSON = {};
        mergeJSON.merges = [];
        Promise.each(Object.keys(supportedComponents), function(iMerge) {
            return record.getMergesAsync(iMerge, 'test', 'procedure problem product allergen vital name smoking_statuses encounter result_set results', 'filename uploadDate')
                .then(function(mergeList) {
                     return mergeJSON.merges = mergeJSON.merges.concat(mergeList);
                });
        })
        .then(function(total) {
            res.send(mergeJSON);
        })
        .catch(function(e) {
            app.winston.warn(400 + ' Bad Request: ', e);
            res.send(400, e);
        });

    });
}