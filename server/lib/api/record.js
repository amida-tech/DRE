module.exports = function (app) {
    var record = require('blue-button-record');
    var config = require('config');
    var supportedComponents = config.supportedComponents;

    function formatResponse(srcComponent, srcResponse) {
        var srcReturn = {};
        //Clean __v tag.
        for (var ir in srcResponse) {
            if (srcResponse[ir].__v >= 0) {
                delete srcResponse[ir].__v;
            }
        }

        srcReturn[srcComponent] = srcResponse;
        return srcReturn;
    }

    app.get('/api/v1/record/:component', function(req, res) {

        if (!supportedComponents[req.params.component]) {
            app.winston.warn(404 + ' supportedComponent could not be found');
            res.send(404);
        } else {

            function sendResponse(componentName) {
                record.getSection(req.params.component, 'test', function(err, componentList) {
                    if (err) {
                        app.winston.error(500 + ' Internal Server Error: ', err);
                        res.send(500);
                    } else {
                        var apiResponse = formatResponse(componentName, componentList);
                        res.send(apiResponse);
                    }
                });
            }
            sendResponse(req.params.component);
        }
    });
}
